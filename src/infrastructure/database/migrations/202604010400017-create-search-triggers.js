// migrations/013-create-search-triggers.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Function to sync product to search document
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION sync_product_search_document()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO search_documents (
          entity_type, entity_id, store_id, vendor_id, section_id,
          title, content, search_vector, filters, sort_data, is_active, last_synced_at
        )
        SELECT 
          'product',
          p.id,
          p.store_id,
          p.vendor_id,
          p.section_id,
          p.name,
          COALESCE(p.name, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.search_keywords, ''),
          to_tsvector('english', 
            COALESCE(p.name, '') || ' ' || 
            COALESCE(p.description, '') || ' ' || 
            COALESCE(p.search_keywords, '')
          ),
          jsonb_build_object(
            'price_min', p.min_variant_price,
            'price_max', p.max_variant_price,
            'in_stock', p.in_stock,
            'status', p.status
          ),
          jsonb_build_object(
            'price', p.base_price,
            'created_at', p.created_at,
            'name', p.name
          ),
          p.is_active AND p.status = 'published',
          NOW()
        FROM products p
        WHERE p.id = COALESCE(NEW.id, OLD.id)
        ON CONFLICT (entity_type, entity_id) 
        DO UPDATE SET
          title = EXCLUDED.title,
          content = EXCLUDED.content,
          search_vector = EXCLUDED.search_vector,
          filters = EXCLUDED.filters,
          sort_data = EXCLUDED.sort_data,
          is_active = EXCLUDED.is_active,
          last_synced_at = NOW();
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger on products
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS product_search_sync_trigger ON products;
      CREATE TRIGGER product_search_sync_trigger
      AFTER INSERT OR UPDATE ON products
      FOR EACH ROW
      EXECUTE FUNCTION sync_product_search_document();
    `);

    // Function to calculate stock status based on quantities
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION calculate_stock_status(
        p_stock_quantity INTEGER,
        p_reserved_quantity INTEGER,
        p_low_threshold INTEGER,
        p_allow_backorders BOOLEAN
      ) RETURNS VARCHAR(20) AS $$
      BEGIN
        IF p_stock_quantity IS NULL OR p_stock_quantity = 0 THEN
          RETURN 'out_of_stock';
        ELSIF p_stock_quantity <= COALESCE(p_low_threshold, 0) THEN
          RETURN 'low_stock';
        ELSIF (p_stock_quantity - COALESCE(p_reserved_quantity, 0)) <= 0 AND p_allow_backorders THEN
          RETURN 'backorder';
        ELSE
          RETURN 'in_stock';
        END IF;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Function to update inventory quantities and status
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_inventory_quantities()
      RETURNS TRIGGER AS $$
      DECLARE
        v_new_available INTEGER;
        v_new_status VARCHAR(20);
      BEGIN
        -- Calculate available quantity
        v_new_available := COALESCE(NEW.stock_quantity, 0) - COALESCE(NEW.reserved_quantity, 0);
        
        -- Determine stock status
        v_new_status := calculate_stock_status(
          NEW.stock_quantity,
          NEW.reserved_quantity,
          NEW.low_stock_threshold,
          NEW.allow_backorders
        );

        -- Update the record
        NEW.quantity := v_new_available;
        NEW.stock_status := v_new_status;
        NEW.updated_at := NOW();

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger to auto-update inventory before insert/update
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS inventory_auto_update_trigger ON inventories;
      CREATE TRIGGER inventory_auto_update_trigger
      BEFORE INSERT OR UPDATE ON inventories
      FOR EACH ROW
      EXECUTE FUNCTION update_inventory_quantities();
    `);

    // Function to update product denormalized fields from variants/inventories
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_product_variant_stats()
      RETURNS TRIGGER AS $$
      DECLARE
        v_product_id INTEGER;
        v_base_price DECIMAL(12,2);
        v_min_price DECIMAL(12,2);
        v_max_price DECIMAL(12,2);
        v_total_stock INTEGER;
        v_in_stock BOOLEAN;
      BEGIN
        -- Determine which product to update
        IF TG_OP = 'DELETE' THEN
          v_product_id := OLD.product_id;
        ELSE
          v_product_id := NEW.product_id;
        END IF;

        -- Get base price
        SELECT base_price INTO v_base_price
        FROM products WHERE id = v_product_id;

        -- Calculate min/max variant prices
        SELECT 
          COALESCE(MIN(COALESCE(price, v_base_price)), v_base_price),
          COALESCE(MAX(COALESCE(price, v_base_price)), v_base_price)
        INTO v_min_price, v_max_price
        FROM product_variants
        WHERE product_id = v_product_id
        AND status = 'active';

        -- Calculate total stock from inventories (sum of stock_quantity)
        SELECT COALESCE(SUM(stock_quantity), 0)
        INTO v_total_stock
        FROM inventories
        WHERE product_id = v_product_id;

        -- Check if any variant is in stock (available quantity > 0)
        SELECT EXISTS(
          SELECT 1 
          FROM inventories
          WHERE product_id = v_product_id
          AND quantity > 0
        ) INTO v_in_stock;

        -- Update product
        UPDATE products
        SET 
          min_variant_price = v_min_price,
          max_variant_price = v_max_price,
          total_stock_quantity = v_total_stock,
          in_stock = v_in_stock,
          updated_at = NOW()
        WHERE id = v_product_id;
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Trigger on variant changes
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS variant_stats_sync_trigger ON product_variants;
      CREATE TRIGGER variant_stats_sync_trigger
      AFTER INSERT OR UPDATE OR DELETE ON product_variants
      FOR EACH ROW
      EXECUTE FUNCTION update_product_variant_stats();
    `);

    // Function to update product stock when inventory changes
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION update_product_stock_from_inventory()
      RETURNS TRIGGER AS $$
      DECLARE
        v_product_id INTEGER;
        v_total_stock INTEGER;
        v_in_stock BOOLEAN;
      BEGIN
        -- Get product_id from the record
        IF TG_OP = 'DELETE' THEN
          v_product_id := OLD.product_id;
        ELSE
          v_product_id := NEW.product_id;
        END IF;

        -- Calculate total stock from inventories for this product
        SELECT COALESCE(SUM(stock_quantity), 0)
        INTO v_total_stock
        FROM inventories
        WHERE product_id = v_product_id;

        -- Check if any inventory record has available quantity
        SELECT EXISTS(
          SELECT 1 
          FROM inventories
          WHERE product_id = v_product_id
          AND quantity > 0
        ) INTO v_in_stock;

        -- Update product
        UPDATE products
        SET 
          total_stock_quantity = v_total_stock,
          in_stock = v_in_stock,
          updated_at = NOW()
        WHERE id = v_product_id;
        
        RETURN COALESCE(NEW, OLD);
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS inventory_stock_sync_trigger ON inventories;
      CREATE TRIGGER inventory_stock_sync_trigger
      AFTER INSERT OR UPDATE OR DELETE ON inventories
      FOR EACH ROW
      EXECUTE FUNCTION update_product_stock_from_inventory();
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS product_search_sync_trigger ON products;
      DROP TRIGGER IF EXISTS variant_stats_sync_trigger ON product_variants;
      DROP TRIGGER IF EXISTS inventory_stock_sync_trigger ON inventories;
      DROP TRIGGER IF EXISTS inventory_auto_update_trigger ON inventories;
      DROP FUNCTION IF EXISTS sync_product_search_document();
      DROP FUNCTION IF EXISTS update_product_variant_stats();
      DROP FUNCTION IF EXISTS update_product_stock_from_inventory();
      DROP FUNCTION IF EXISTS update_inventory_quantities();
      DROP FUNCTION IF EXISTS calculate_stock_status();
    `);
  },
};
