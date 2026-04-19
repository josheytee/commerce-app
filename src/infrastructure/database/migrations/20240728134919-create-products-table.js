'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sections',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      short_description: {
        type: Sequelize.TEXT,
      },
      search_keywords: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      specification: {
        type: Sequelize.TEXT,
      },
      base_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      compare_at_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      cost_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true,
      },
      // Denormalized search fields
      min_variant_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      max_variant_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_stock_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sales_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      total_ratings: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      in_stock: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      meta_title: {
        type: Sequelize.STRING(160),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      meta_keywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      available_from: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      available_to: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      review_able: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_taxable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM(
          'draft',
          'pending',
          'published',
          'archived',
          'out_of_stock',
          'discontinued',
        ),
        defaultValue: 'draft',
        allowNull: false,
      },
      product_type: {
        type: Sequelize.ENUM(
          'simple',
          'variable',
          'digital',
          'service',
          'bundle',
        ),
        defaultValue: 'simple',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
    // Add unique constraint for store_id + slug
    await queryInterface.addConstraint('products', {
      fields: ['store_id', 'slug'],
      type: 'unique',
      name: 'products_store_slug_unique',
    });

    // Add unique constraint for vendor_id + sku

     // Indexes
    await queryInterface.addIndex('products', ['store_id', 'vendor_id', 'slug'], {
      unique: true,
      name: 'products_store_vendor_slug_unique',
    });
    await queryInterface.addIndex('products', ['store_id', 'status'], {
      name: 'products_store_status_idx',
    });
    await queryInterface.addIndex('products', ['vendor_id', 'status'], {
      name: 'products_vendor_status_idx',
    });
    await queryInterface.addIndex('products', ['section_id'], {
      name: 'products_section_idx',
    });
    await queryInterface.addIndex('products', ['status', 'is_active'], {
      name: 'products_status_active_idx',
    });
    await queryInterface.addIndex('products', ['product_type'], {
      name: 'products_type_idx',
    });
    await queryInterface.addIndex('products', ['base_price'], {
      name: 'products_base_price_idx',
    });
    await queryInterface.addIndex('products', ['min_variant_price', 'max_variant_price'], {
      name: 'products_variant_price_idx',
    });
    await queryInterface.addIndex('products', ['in_stock'], {
      name: 'products_stock_idx',
    });
    await queryInterface.addIndex('products', ['created_at'], {
      name: 'products_created_idx',
    });

    // Full-text search index (PostgreSQL)
    await queryInterface.sequelize.query(`
      CREATE INDEX products_fts_idx ON products 
      USING GIN (to_tsvector('english', 
        coalesce(name, '') || ' ' || 
        coalesce(description, '') || ' ' || 
        coalesce(search_keywords, '')
      ));
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
