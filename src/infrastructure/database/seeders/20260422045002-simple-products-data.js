// seeders/003-demo-simple-products.js
'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create variants for simple/digital/service products (1 variant each)
    const [products] = await queryInterface.sequelize.query(`
      SELECT id, base_price, product_type 
      FROM products 
      WHERE product_type IN ('simple', 'digital', 'service') 
      LIMIT 30;
    `);

    if (!products.length) return;

    const variants = products.map(product => ({
      product_id: product.id,
      sku: `${faker.string.alphanumeric(3).toUpperCase()}-${product.id}-DEFAULT`,
      barcode: faker.string.numeric(13),
      attributes: JSON.stringify({ type: 'default' }),
      variant_name: 'Default',
      price: null, // Inherit from product
      compare_at_price: null,
      cost_price: product.base_price * 0.6,
      image_url: null,
      weight: product.product_type === 'digital' ? 0 : faker.number.float({ min: 0.5, max: 10, fractionDigits: 2 }),
      length: null,
      width: null,
      height: null,
      requires_shipping: product.product_type !== 'digital',
      shipping_class: product.product_type === 'digital' ? null : 'standard',
      metadata: JSON.stringify({ is_default: true }),
      status: 'active',
      created_at: faker.date.past({ years: 1 }),
      updated_at: faker.date.recent(),
    }));

    await queryInterface.bulkInsert('product_variants', variants);
    console.log(`Inserted ${variants.length} default variants for simple products`);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('product_variants', {
      attributes: { [Sequelize.Op.contains]: { is_default: true } },
    });
  },
};
