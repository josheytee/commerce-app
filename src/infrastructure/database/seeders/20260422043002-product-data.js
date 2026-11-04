// seeders/001-demo-products.js
'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get existing stores, vendors, and sections
    const [stores] = await queryInterface.sequelize.query(
      'SELECT id, vendor_id FROM stores LIMIT 50;',
    );
    const [vendors] = await queryInterface.sequelize.query(
      'SELECT id FROM vendors LIMIT 10;',
    );
    const [sections] = await queryInterface.sequelize.query(
      'SELECT id FROM sections LIMIT 20;',
    );

    if (!stores.length || !vendors.length || !sections.length) {
      console.log('Skipping products seeder: missing dependencies');
      return;
    }

    const products = [];
    const productTypes = ['simple', 'variable', 'digital', 'service', 'bundle'];
    const statuses = [
      'draft',
      'pending',
      'published',
      'archived',
      'out_of_stock',
      'discontinued',
    ];

    // Generate 50 products
    for (let i = 0; i < 50; i++) {
      const vendor = faker.helpers.arrayElement(vendors);
      const store = faker.helpers.arrayElement(stores);
      const productType = faker.helpers.arrayElement(productTypes);
      const status = faker.helpers.arrayElement(statuses);
      const basePrice = faker.number.float({
        min: 10,
        max: 1000,
        fractionDigits: 2,
      });
      const isActive =
        status === 'published' && faker.datatype.boolean({ probability: 0.8 });

      products.push({
        store_id: store.id,
        vendor_id: vendor.id,
        section_id: faker.helpers.arrayElement(sections).id,
        name: faker.commerce.productName(),
        slug: faker.helpers
          .slugify(
            `${faker.commerce.productName()}-${i}-${faker.string.alphanumeric(6)}`,
          )
          .toLowerCase(),
        description: faker.commerce.productDescription(),
        short_description: faker.lorem.sentence(10),
        specification: JSON.stringify({
          material: faker.commerce.productMaterial(),
          warranty: `${faker.number.int({ min: 1, max: 5 })} years`,
          origin: faker.location.country(),
        }),
        base_price: basePrice,
        compare_at_price: faker.datatype.boolean({ probability: 0.3 })
          ? basePrice * 1.2
          : null,
        cost_price: basePrice * 0.6,
        // sku: `SKU-${vendor.id}-${String(i).padStart(3, '0')}`,
        // Denormalized fields (will be updated by variants)
        min_variant_price: basePrice,
        max_variant_price: basePrice,
        sales_count: faker.number.int({ min: 0, max: 5000 }),
        total_ratings: faker.number.int({ min: 0, max: 500 }),
        views: faker.number.int({ min: 0, max: 50000 }),
        meta_title: faker.commerce.productName(),
        meta_description: faker.lorem.sentence(15),
        meta_keywords: faker.commerce.productAdjective(),
        published_at:
          status === 'published' ? faker.date.past({ years: 1 }) : null,
        available_from: faker.datatype.boolean({ probability: 0.8 })
          ? faker.date.past({ years: 1 })
          : null,
        available_to: faker.datatype.boolean({ probability: 0.2 })
          ? faker.date.future({ years: 1 })
          : null,
        is_featured: faker.datatype.boolean({ probability: 0.1 }),
        is_active: isActive,
        review_able: faker.datatype.boolean({ probability: 0.9 }),
        is_taxable: faker.datatype.boolean({ probability: 0.8 }),
        status: status,
        product_type: productType,
        created_at: faker.date.past({ years: 2 }),
        updated_at: faker.date.recent(),
        deleted_at: null,
      });
    }

    // Insert products and get IDs
    const insertedProducts = await queryInterface.bulkInsert(
      'products',
      products,
      {
        returning: ['id', 'product_type', 'base_price'],
      },
    );

    console.log(`Inserted ${insertedProducts.length} products`);

    // Insert media for products
    const mediaRecords = [];
    for (const product of insertedProducts) {
      const imageCount = faker.number.int({ min: 1, max: 5 });
      for (let j = 0; j < imageCount; j++) {
        const imageSeed = faker.string.alphanumeric(12);
        mediaRecords.push({
          url: `https://picsum.photos/seed/${imageSeed}/800/600`,
          key: `products/${product.id}/${imageSeed}.jpg`,
          thumbnail_url: `https://picsum.photos/seed/${imageSeed}/300/200`,
          medium_url: `https://picsum.photos/seed/${imageSeed}/400/300`,
          alt_text: faker.commerce.productName(),
          title: faker.commerce.productName().slice(0, 100),
          caption: faker.commerce.productDescription(),
          type: 'product_image',
          entity_type: 'product',
          entity_id: product.id,
          sort_order: j,
          is_primary: j === 0,
          metadata: JSON.stringify({
            width: 800,
            height: 600,
            format: 'jpg',
            seed: imageSeed,
          }),
          file_size: faker.number.int({ min: 15000, max: 3500000 }),
          mime_type: 'image/jpeg',
          uploaded_by: faker.number.int({ min: 1, max: 10 }),
          created_at: faker.date.past({ years: 2 }),
          updated_at: faker.date.recent(),
        });
      }
    }

    if (mediaRecords.length > 0) {
      await queryInterface.bulkInsert('media', mediaRecords);
      console.log(`Inserted ${mediaRecords.length} media records`);
    }

    // Return for variant generation
    return insertedProducts;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('media', { entity_type: 'product' }, {});
    await queryInterface.bulkDelete('products', null, {});
  },
};
