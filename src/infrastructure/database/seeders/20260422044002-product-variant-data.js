// seeders/002-demo-product-variants.js
'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get variable products
    const [products] = await queryInterface.sequelize.query(`
      SELECT id, base_price, name, store_id
      FROM products 
      WHERE product_type = 'variable' 
      LIMIT 20;
    `);

    if (!products.length) {
      console.log('No variable products found');
      return;
    }

    // Get warehouses for inventory
    const [warehouses] = await queryInterface.sequelize.query(`
      SELECT id FROM warehouses LIMIT 5;
    `);

    // Fetch attributes
    const [dbAttributes] = await queryInterface.sequelize.query(`
      SELECT a.id AS attr_id, a.code, av.id AS value_id, 
             av.value, av.display_value, av.color_code
      FROM attributes a
      JOIN attribute_values av ON av.attribute_id = a.id
      WHERE a.code IN ('color', 'size', 'material')
      ORDER BY a.code, av.sort_order;
    `);

    const attributes = dbAttributes.reduce((acc, row) => {
      if (!acc[row.code]) acc[row.code] = { id: row.attr_id, values: [] };
      acc[row.code].values.push({
        valueId: row.value_id,
        value: row.value,
        display: row.display_value,
        colorCode: row.color_code,
      });
      return acc;
    }, {});

    const colors = attributes.color?.values || [];
    const sizes = attributes.size?.values || [];
    const materials = attributes.material?.values || [];

    if (!colors.length || !sizes.length) {
      console.log('Missing color/size attributes');
      return;
    }

    const variants = [];
    const variantLinks = [];
    const shippingClasses = ['standard', 'express', 'free', 'heavy', 'fragile'];

    for (const product of products) {
      const count = faker.number.int({ min: 3, max: 8 });
      const used = new Set();
      let created = 0;

      while (created < count && used.size < count * 3) {
        const color = faker.helpers.arrayElement(colors);
        const size = faker.helpers.arrayElement(sizes);
        const material = materials.length
          ? faker.helpers.arrayElement(materials)
          : null;
        const key = `${color.value}-${size.value}-${material?.value || 'none'}`;

        if (used.has(key)) continue;
        used.add(key);
        created++;

        const hasPrice = faker.datatype.boolean(0.5);
        const price = hasPrice
          ? parseFloat(
              (
                product.base_price *
                faker.number.float({ min: 0.85, max: 1.35 })
              ).toFixed(2),
            )
          : null;
        const final = price || parseFloat(product.base_price);

        const idx = variants.length;
        variants.push({
          product_id: product.id,
          sku: `${faker.string.alpha(3).toUpperCase()}-${product.id}-${faker.string.alphanumeric(4).toUpperCase()}`,
          barcode: faker.datatype.boolean(0.6)
            ? faker.string.numeric(13)
            : null,
          attributes: JSON.stringify({
            color: color.value,
            size: size.value,
            ...(material && { material: material.value }),
          }),
          variant_name: [color.display, size.display, material?.display]
            .filter(Boolean)
            .join(' / '),
          price: price,
          compare_at_price: parseFloat((final * 1.25).toFixed(2)),
          cost_price: parseFloat((final * 0.5).toFixed(2)),
          image_url: faker.image.url({ width: 800, height: 800 }),
          weight: faker.number.float({ min: 0.1, max: 25, fractionDigits: 3 }),
          length: faker.number.float({ min: 5, max: 100, fractionDigits: 1 }),
          width: faker.number.float({ min: 5, max: 80, fractionDigits: 1 }),
          height: faker.number.float({ min: 1, max: 50, fractionDigits: 1 }),
          requires_shipping: faker.datatype.boolean(0.9),
          shipping_class: faker.helpers.arrayElement(shippingClasses),
          metadata: JSON.stringify({
            warehouse: faker.location.city(),
            color_hex: color.colorCode,
          }),
          status: faker.helpers.arrayElement([
            'active',
            'inactive',
            'out_of_stock',
            'discontinued',
          ]),
          created_at: faker.date.past({ years: 1 }),
          updated_at: faker.date.recent(),
        });

        variantLinks.push(
          { idx, attrId: attributes.color.id, valId: color.valueId },
          { idx, attrId: attributes.size.id, valId: size.valueId },
        );
        if (material)
          variantLinks.push({
            idx,
            attrId: attributes.material.id,
            valId: material.valueId,
          });
      }
    }

    const inserted = await queryInterface.bulkInsert(
      'product_variants',
      variants,
      { returning: ['id'] },
    );
    console.log(`Inserted ${inserted.length} variants`);

    // Junction table
    const links = variantLinks.map((l) => ({
      variant_id: inserted[l.idx].id,
      attribute_id: l.attrId,
      attribute_value_id: l.valId,
      // created_at: new Date(),
      // updated_at: new Date(),
    }));
    await queryInterface.bulkInsert('product_variant_attribute_values', links);
    console.log(`Inserted ${links.length} attribute links`);

    // Create inventory records matching your schema
    const inventoryRecords = inserted.map((v, i) => {
      const variant = variants[i];
      const product = products.find((p) => p.id === variant.product_id);
      const stockQty = faker.number.int({ min: 0, max: 500 });
      const reservedQty = faker.number.int({
        min: 0,
        max: Math.min(stockQty, 50),
      });

      // Determine stock status based on quantity
      let stockStatus = 'in_stock';
      if (stockQty === 0) stockStatus = 'out_of_stock';
      else if (stockQty <= 10) stockStatus = 'low_stock';
      else if (faker.datatype.boolean(0.1)) stockStatus = 'backorder';

      return {
        store_id: product?.store_id || null,
        product_id: variant.product_id,
        product_variant_id: v.id,
        quantity: stockQty - reservedQty, // Available quantity
        stock_quantity: stockQty, // Total physical stock
        stock_status: stockStatus,
        low_stock_threshold: faker.number.int({ min: 5, max: 20 }),
        reserved_quantity: reservedQty,
        track_quantity: faker.datatype.boolean(0.8),
        allow_backorders: faker.datatype.boolean(0.2),
        warehouse_id: warehouses.length
          ? faker.helpers.arrayElement(warehouses).id
          : null,
        location_details: JSON.stringify({
          aisle: faker.string.alpha(1).toUpperCase(),
          shelf: faker.number.int({ min: 1, max: 20 }),
          bin: faker.number.int({ min: 1, max: 50 }),
        }),
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert('inventories', inventoryRecords);
    console.log(`Inserted ${inventoryRecords.length} inventory records`);

    return inserted;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('inventories', null, {});
    await queryInterface.bulkDelete(
      'product_variant_attribute_values',
      null,
      {},
    );
    await queryInterface.bulkDelete('product_variants', null, {});
  },
};
