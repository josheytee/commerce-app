// seeders/002-demo-product-variants.js
'use strict';

const { faker } = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [products] = await queryInterface.sequelize.query(
      'SELECT id, product_type, base_price, vendor_id FROM products;',
    );

    if (!products.length) {
      console.log('Skipping product variants seeder: no products found');
      return;
    }

    const stockStatuses = [
      'active',
      'inactive',
      'out_of_stock',
      // 'low_stock',
      // 'backorder',
      'discontinued',
    ];
    const colors = [
      'Red',
      'Blue',
      'Black',
      'White',
      'Green',
      'Navy',
      'Gray',
      'Yellow',
      'Purple',
      'Orange',
      'Pink',
      'Teal',
    ];
    const sizes = [
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      '36',
      '38',
      '40',
      '42',
      '44',
      '46',
      '48',
    ];

    const variants = [];
    const mediaRecords = [];

    for (const product of products) {
      const isVariable = product.product_type === 'variable';
      const variantCount = isVariable
        ? faker.number.int({ min: 3, max: 12 })
        : 1;

      // Track used combinations for variable products to avoid duplicates
      const usedCombinations = new Set();

      for (let i = 0; i < variantCount; i++) {
        let variantName = 'Default';
        let metadata = null;

        if (isVariable) {
          let color, size, comboKey;
          let attempts = 0;

          // Ensure unique color/size combinations per product
          do {
            color = faker.helpers.arrayElement(colors);
            size = faker.helpers.arrayElement(sizes);
            comboKey = `${color}-${size}`;
            attempts++;
          } while (usedCombinations.has(comboKey) && attempts < 50);

          usedCombinations.add(comboKey);
          variantName = `${color} / Size ${size}`;
          metadata = JSON.stringify({
            color,
            size,
            origin: faker.location.country(),
          });
        }

        const basePrice = parseFloat(product.base_price);
        const hasPriceOverride =
          isVariable && faker.datatype.boolean({ probability: 0.7 });
        const price = hasPriceOverride
          ? Math.max(
              5,
              basePrice +
                faker.number.float({ min: -15, max: 40, fractionDigits: 2 }),
            )
          : basePrice;

        const compareAtPrice = faker.datatype.boolean({ probability: 0.25 })
          ? parseFloat((price * 1.2).toFixed(2))
          : null;

        const isDigitalOrService =
          product.product_type === 'digital' ||
          product.product_type === 'service';

        variants.push({
          product_id: product.id,
          sku: `VAR-${product.vendor_id}-${product.id}-${String(i).padStart(3, '0')}`,
          barcode: faker.datatype.boolean({ probability: 0.6 })
            ? faker.string.numeric(13)
            : null,
          mpn: faker.datatype.boolean({ probability: 0.3 })
            ? `${faker.string.alpha({ length: 3 }).toUpperCase()}-${faker.string.numeric(6)}`
            : null,
          variant_name: variantName,
          price: price,
          compare_at_price: compareAtPrice,
          cost_price: parseFloat((price * 0.55).toFixed(2)),
          image_url: faker.datatype.boolean({ probability: 0.4 })
            ? `https://picsum.photos/seed/${faker.string.alphanumeric(10)}/400/400`
            : null,
          weight: isDigitalOrService
            ? null
            : faker.number.float({ min: 0.1, max: 20, fractionDigits: 2 }),
          length: faker.datatype.boolean({ probability: 0.4 })
            ? faker.number.float({ min: 5, max: 100, fractionDigits: 2 })
            : null,
          width: faker.datatype.boolean({ probability: 0.4 })
            ? faker.number.float({ min: 5, max: 80, fractionDigits: 2 })
            : null,
          height: faker.datatype.boolean({ probability: 0.4 })
            ? faker.number.float({ min: 1, max: 60, fractionDigits: 2 })
            : null,
          requires_shipping: isDigitalOrService ? false : true,
          shipping_class: faker.datatype.boolean({ probability: 0.25 })
            ? faker.helpers.arrayElement([
                'standard',
                'express',
                'free',
                'heavy',
                'fragile',
              ])
            : null,
          metadata: metadata,
          status: faker.helpers.arrayElement(stockStatuses),
          created_at: faker.date.past({ years: 2 }),
          updated_at: faker.date.recent(),
        });
      }
    }

    // Insert variants
    const insertedVariants = await queryInterface.bulkInsert(
      'product_variants',
      variants,
      { returning: ['id', 'product_id'] },
    );

    console.log(`Inserted ${insertedVariants.length} product variants`);

    // Generate gallery media for variants (polymorphic)
    for (const variant of insertedVariants) {
      const imageCount = faker.number.int({ min: 0, max: 3 });

      for (let j = 0; j < imageCount; j++) {
        const imageSeed = faker.string.alphanumeric(12);
        mediaRecords.push({
          url: `https://picsum.photos/seed/${imageSeed}/600/600`,
          key: `variants/${variant.id}/${imageSeed}.jpg`,
          thumbnail_url: `https://picsum.photos/seed/${imageSeed}/200/200`,
          medium_url: `https://picsum.photos/seed/${imageSeed}/400/400`,
          alt_text: faker.commerce.productName(),
          title: faker.commerce.productName().slice(0, 100),
          caption: faker.lorem.sentence(8),
          type: 'variant_image',
          entity_type: 'product_variant',
          entity_id: variant.id,
          sort_order: j,
          is_primary: j === 0,
          metadata: JSON.stringify({
            width: 600,
            height: 600,
            format: 'jpg',
            seed: imageSeed,
          }),
          file_size: faker.number.int({ min: 8000, max: 2000000 }),
          mime_type: 'image/jpeg',
          uploaded_by: faker.number.int({ min: 1, max: 10 }),
          created_at: faker.date.past({ years: 2 }),
          updated_at: faker.date.recent(),
        });
      }
    }

    if (mediaRecords.length > 0) {
      await queryInterface.bulkInsert('media', mediaRecords);
      console.log(`Inserted ${mediaRecords.length} variant media records`);
    }

    return insertedVariants;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      'media',
      { entity_type: 'product_variant' },
      {},
    );
    await queryInterface.bulkDelete('product_variants', null, {});
  },
};
