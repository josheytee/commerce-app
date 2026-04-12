// seeders/20240101000002-minimal-sections.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const sections = [
      // Main categories
      {
        id: 1,
        name: 'Electronics',
        slug: 'electronics',
        cover: 'https://example.com/electronics.jpg',
        description: 'Electronic products',
        parent_id: null,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: 'Fashion',
        slug: 'fashion',
        cover: 'https://example.com/fashion.jpg',
        description: 'Fashion items',
        parent_id: null,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: 'Home & Living',
        slug: 'home-living',
        cover: 'https://example.com/home.jpg',
        description: 'Home products',
        parent_id: null,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        name: 'Beauty',
        slug: 'beauty',
        cover: 'https://example.com/beauty.jpg',
        description: 'Beauty products',
        parent_id: null,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 5,
        name: 'Books',
        slug: 'books',
        cover: 'https://example.com/books.jpg',
        description: 'Books and stationery',
        parent_id: null,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Subcategories for Electronics
      {
        id: 6,
        name: 'Smartphones',
        slug: 'smartphones',
        cover: 'https://example.com/smartphones.jpg',
        description: 'Mobile phones',
        parent_id: 1,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7,
        name: 'Laptops',
        slug: 'laptops',
        cover: 'https://example.com/laptops.jpg',
        description: 'Computers',
        parent_id: 1,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 8,
        name: 'Accessories',
        slug: 'accessories',
        cover: 'https://example.com/accessories.jpg',
        description: 'Gadget accessories',
        parent_id: 1,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Subcategories for Fashion
      {
        id: 9,
        name: "Men's Wear",
        slug: 'mens-wear',
        cover: 'https://example.com/mens.jpg',
        description: "Men's clothing",
        parent_id: 2,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 10,
        name: "Women's Wear",
        slug: 'womens-wear',
        cover: 'https://example.com/womens.jpg',
        description: "Women's clothing",
        parent_id: 2,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 11,
        name: 'Shoes',
        slug: 'shoes',
        cover: 'https://example.com/shoes.jpg',
        description: 'Footwear',
        parent_id: 2,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      // Subcategories for Home
      {
        id: 12,
        name: 'Furniture',
        slug: 'furniture',
        cover: 'https://example.com/furniture.jpg',
        description: 'Home furniture',
        parent_id: 3,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 13,
        name: 'Kitchen',
        slug: 'kitchen',
        cover: 'https://example.com/kitchen.jpg',
        description: 'Kitchenware',
        parent_id: 3,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 14,
        name: 'Decor',
        slug: 'decor',
        cover: 'https://example.com/decor.jpg',
        description: 'Home decor',
        parent_id: 3,
        store_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('sections', sections, {});
    console.log(`✅ Inserted ${sections.length} sections`);

    // Reset sequence
    await queryInterface.sequelize.query(
      `SELECT setval('sections_id_seq', (SELECT MAX(id) FROM sections));`,
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('sections', null, {});
    console.log('✅ Sections removed');

    await queryInterface.sequelize.query(
      `ALTER SEQUENCE sections_id_seq RESTART WITH 1;`,
    );
  },
};
