'use strict';

const { faker } = require('@faker-js/faker');

// Product statuses
const PRODUCT_STATUSES = ['draft', 'published', 'archived'];
const PRODUCT_TYPES = ['simple', 'variable'];
const VARIANT_STATUSES = ['in_stock', 'low_stock', 'out_of_stock'];

// Product name generators by category
const PRODUCT_NAMES = {
  1: [
    'Smartphone',
    'Laptop',
    'Tablet',
    'Headphones',
    'Smartwatch',
    'Bluetooth Speaker',
    'Gaming Mouse',
    'Mechanical Keyboard',
    'Monitor',
    'External Hard Drive',
    'USB Flash Drive',
    'Power Bank',
    'Charger',
    'Phone Case',
    'Screen Protector',
  ],
  2: [
    'T-Shirt',
    'Jeans',
    'Dress',
    'Jacket',
    'Sneakers',
    'Handbag',
    'Sunglasses',
    'Watch',
    'Belt',
    'Scarf',
    'Hat',
    'Socks',
    'Hoodie',
    'Sweater',
    'Shorts',
  ],
  3: [
    'Sofa',
    'Bed Frame',
    'Dining Table',
    'Chair',
    'Lamp',
    'Rug',
    'Curtains',
    'Pillow',
    'Blanket',
    'Mirror',
    'Clock',
    'Vase',
    'Picture Frame',
    'Bookshelf',
  ],
  4: [
    'Lipstick',
    'Foundation',
    'Mascara',
    'Eyeshadow',
    'Moisturizer',
    'Serum',
    'Face Wash',
    'Shampoo',
    'Conditioner',
    'Hair Dryer',
    'Straightener',
    'Perfume',
  ],
  5: [
    'Rice',
    'Beans',
    'Pasta',
    'Bread',
    'Cookies',
    'Chocolate',
    'Coffee',
    'Tea',
    'Juice',
    'Soda',
    'Water',
    'Spices',
    'Oil',
    'Canned Goods',
    'Frozen Foods',
  ],
};

// Track used slugs per store to ensure uniqueness
const usedSlugsPerStore = new Map();

// Generate unique product slug within a store
const generateUniqueSlug = (name, storeId, productIndex) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Initialize tracking for this store if not exists
  if (!usedSlugsPerStore.has(storeId)) {
    usedSlugsPerStore.set(storeId, new Set());
  }

  const usedSlugs = usedSlugsPerStore.get(storeId);
  let slug = baseSlug;
  let counter = 1;

  // Ensure uniqueness by adding counter if needed
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  usedSlugs.add(slug);
  return slug;
};

// Generate product name with store-specific uniqueness
const generateProductName = (categoryId, productIndex, storeId) => {
  const names = PRODUCT_NAMES[categoryId] || PRODUCT_NAMES[1];
  const name = names[Math.floor(Math.random() * names.length)];
  const modifiers = [
    'Premium',
    'Deluxe',
    'Pro',
    'Plus',
    'Ultra',
    'Essential',
    'Basic',
  ];
  const modifier =
    Math.random() > 0.7
      ? modifiers[Math.floor(Math.random() * modifiers.length)] + ' '
      : '';

  // Add store-specific suffix to reduce collisions
  const storeSuffix = Math.floor(Math.random() * 100) + 1;
  return `${modifier}${name} ${storeSuffix}`;
};

// Generate product description
const generateDescription = (name, categoryName) => {
  const templates = [
    `Experience the best ${categoryName} with our ${name}. High-quality materials, excellent craftsmanship, and guaranteed satisfaction.`,
    `The ${name} is a premium ${categoryName} product that combines style, functionality, and durability. Perfect for everyday use.`,
    `Upgrade your lifestyle with the ${name}. This ${categoryName} product features modern design and superior performance.`,
    `Discover why customers love our ${name}. Built to last and designed for comfort, this ${categoryName} product exceeds expectations.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate short description
const generateShortDescription = (name) => {
  const templates = [
    `High-quality ${name} for your daily needs`,
    `Premium ${name} with excellent features`,
    `Best-selling ${name} loved by customers`,
    `Affordable ${name} with guaranteed quality`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate specification
const generateSpecification = () => {
  const specs = {
    Material: [
      'Cotton',
      'Polyester',
      'Leather',
      'Metal',
      'Plastic',
      'Glass',
      'Wood',
    ],
    Color: [
      'Black',
      'White',
      'Red',
      'Blue',
      'Green',
      'Yellow',
      'Purple',
      'Pink',
    ],
    Size: ['S', 'M', 'L', 'XL', 'XXL', 'One Size'],
    Weight: ['100g', '250g', '500g', '1kg', '2kg', '5kg'],
    Warranty: ['6 months', '1 year', '2 years', '5 years'],
    Origin: ['Nigeria', 'China', 'USA', 'UK', 'Germany', 'Japan'],
  };

  const selectedSpecs = {};
  const numSpecs = Math.floor(Math.random() * 3) + 2;
  const keys = Object.keys(specs)
    .sort(() => 0.5 - Math.random())
    .slice(0, numSpecs);

  keys.forEach((key) => {
    const values = specs[key];
    selectedSpecs[key] = values[Math.floor(Math.random() * values.length)];
  });

  return JSON.stringify(selectedSpecs);
};

// Generate SKU
const generateSku = (vendorId, storeId, productId, variantIndex = null) => {
  const vendorPrefix = String(vendorId).padStart(3, '0');
  const storePrefix = String(storeId).padStart(3, '0');
  const productPrefix = String(productId).padStart(5, '0');
  const variantSuffix =
    variantIndex !== null ? `-${String(variantIndex).padStart(2, '0')}` : '';
  return `SKU-${vendorPrefix}-${storePrefix}-${productPrefix}${variantSuffix}`;
};

// Generate variant attributes
const generateVariantAttributes = (type) => {
  const colors = [
    'Black',
    'White',
    'Red',
    'Blue',
    'Green',
    'Yellow',
    'Purple',
    'Pink',
    'Brown',
    'Gray',
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const storage = ['64GB', '128GB', '256GB', '512GB', '1TB'];

  const attributes = {};

  if (type === 'clothing') {
    attributes.color = colors[Math.floor(Math.random() * colors.length)];
    attributes.size = sizes[Math.floor(Math.random() * sizes.length)];
  } else if (type === 'electronics') {
    attributes.color = colors[Math.floor(Math.random() * colors.length)];
    attributes.storage = storage[Math.floor(Math.random() * storage.length)];
  } else {
    if (Math.random() > 0.5)
      attributes.color = colors[Math.floor(Math.random() * colors.length)];
    if (Math.random() > 0.5)
      attributes.size = sizes[Math.floor(Math.random() * sizes.length)];
  }

  return attributes;
};

// Generate product images
const generateProductImages = (productId, count = 3) => {
  const images = [];
  const categories = ['electronics', 'fashion', 'home', 'beauty'];
  const category = categories[Math.floor(Math.random() * categories.length)];

  for (let i = 0; i < count; i++) {
    images.push({
      id: null,
      entity_type: 'product',
      entity_id: productId,
      type: 'product_image',
      url: faker.image.urlLoremFlickr({
        category: category,
        width: 800,
        height: 800,
      }),
      thumbnail_url: faker.image.urlLoremFlickr({
        category: category,
        width: 200,
        height: 200,
      }),
      is_primary: i === 0,
      sort_order: i,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  return images;
};

// Generate products
const generateProducts = async (stores, sections, vendors) => {
  const products = [];
  let productId = 1;

  // Reset the slug tracker for each run
  usedSlugsPerStore.clear();

  for (const store of stores) {
    // Generate 10-30 products per store (reduced to avoid duplicates)
    const numProducts = Math.floor(Math.random() * 20) + 10;

    for (let i = 0; i < numProducts; i++) {
      const section =
        sections.find((s) => s.store_id === store.id && s.parent_id !== null) ||
        sections[Math.floor(Math.random() * sections.length)];
      const categoryId = section?.id || Math.floor(Math.random() * 12) + 1;

      // Generate unique name and slug for this store
      const productName = generateProductName(categoryId, i, store.id);
      const slug = generateUniqueSlug(productName, store.id, i);

      const price = parseFloat((Math.random() * 500 + 10).toFixed(2));
      const compareAtPrice =
        Math.random() > 0.5
          ? parseFloat((price * (1 + Math.random() * 0.5)).toFixed(2))
          : null;
      const costPrice = parseFloat((price * 0.6).toFixed(2));
      const status =
        PRODUCT_STATUSES[Math.floor(Math.random() * PRODUCT_STATUSES.length)];
      const productType =
        PRODUCT_TYPES[Math.floor(Math.random() * PRODUCT_TYPES.length)];
      const isFeatured = Math.random() > 0.85;
      const isActive = status === 'published';
      const totalRatings = Math.floor(Math.random() * 500);
      const salesCount = Math.floor(Math.random() * 1000);
      const views = Math.floor(Math.random() * 5000);

      products.push({
        id: productId++,
        name: productName,
        slug: slug,
        description: generateDescription(
          productName,
          section?.name || 'product',
        ),
        short_description: generateShortDescription(productName),
        specification: generateSpecification(),
        upc: Math.random() > 0.7 ? faker.string.numeric(12) : null,
        ean: Math.random() > 0.7 ? faker.string.numeric(13) : null,
        isbn: Math.random() > 0.9 ? faker.string.numeric(13) : null,
        mpn:
          Math.random() > 0.7
            ? faker.string.alphanumeric(10).toUpperCase()
            : null,
        price: price,
        compare_at_price: compareAtPrice,
        cost_price: costPrice,
        meta_title: `${productName} - Best Price in Nigeria`,
        meta_description: `Shop ${productName} at the best price. Quality guaranteed.`,
        meta_keywords: `${productName.toLowerCase()}, ${section?.name?.toLowerCase()}, buy online, nigeria`,
        status: status,
        product_type: productType,
        is_featured: isFeatured,
        is_active: isActive,
        review_able: true,
        is_taxable: true,
        total_ratings: totalRatings,
        sales_count: salesCount,
        views: views,
        published_at: status === 'published' ? new Date() : null,
        available_from: new Date(),
        available_to: Math.random() > 0.9 ? faker.date.future() : null,
        section_id: section?.id,
        store_id: store.id,
        vendor_id: store.vendor_id,
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
        deleted_at: null,
      });
    }
  }

  return products;
};

// Generate variants for variable products
const generateVariants = (products) => {
  const variants = [];
  let variantId = 1;

  for (const product of products) {
    if (product.product_type === 'variable') {
      const numVariants = Math.floor(Math.random() * 4) + 2; // 2-5 variants

      for (let i = 0; i < numVariants; i++) {
        const variantType =
          product.section_id === 2
            ? 'clothing'
            : product.section_id === 1
              ? 'electronics'
              : 'general';
        const attributes = generateVariantAttributes(variantType);
        const price = parseFloat(
          (product.price * (0.8 + Math.random() * 0.4)).toFixed(2),
        );
        const compareAtPrice =
          Math.random() > 0.5
            ? parseFloat((price * (1 + Math.random() * 0.3)).toFixed(2))
            : null;
        const costPrice = parseFloat((price * 0.7).toFixed(2));

        variants.push({
          id: variantId++,
          product_id: product.id,
          sku: generateSku(product.vendor_id, product.store_id, product.id, i),
          barcode: Math.random() > 0.5 ? faker.string.numeric(12) : null,
          attributes: attributes,
          price: price,
          compare_at_price: compareAtPrice,
          cost_price: costPrice,
          image_url: faker.image.urlLoremFlickr({
            category: 'product',
            width: 500,
            height: 500,
          }),
          weight: parseFloat((Math.random() * 5).toFixed(2)),
          length: parseFloat((Math.random() * 50).toFixed(2)),
          width: parseFloat((Math.random() * 50).toFixed(2)),
          height: parseFloat((Math.random() * 50).toFixed(2)),
          requires_shipping: true,
          shipping_class: ['standard', 'express', 'heavy'][
            Math.floor(Math.random() * 3)
          ],
          metadata: {
            stock_status: ['in_stock', 'low_stock', 'out_of_stock'][
              Math.floor(Math.random() * 3)
            ],
            warehouse_location: ['Lagos', 'Abuja', 'Port Harcourt'][
              Math.floor(Math.random() * 3)
            ],
          },
          created_at: product.created_at,
          updated_at: new Date(),
        });
      }
    }
  }

  return variants;
};

// Generate product attributes
const generateProductAttributes = (products) => {
  const productAttributes = [];
  let id = 1;

  const attributeOptions = [
    {
      attribute_id: 1,
      values: ['Cotton', 'Polyester', 'Leather', 'Denim', 'Silk'],
    },
    {
      attribute_id: 2,
      values: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow'],
    },
    { attribute_id: 3, values: ['S', 'M', 'L', 'XL', 'XXL'] },
    { attribute_id: 4, values: ['New', 'Refurbished', 'Used - Like New'] },
    { attribute_id: 5, values: ['1 Year', '2 Years', '5 Years'] },
  ];

  for (const product of products.slice(0, 100)) {
    const numAttributes = Math.floor(Math.random() * 2) + 1;
    const shuffledOptions = [...attributeOptions].sort(
      () => 0.5 - Math.random(),
    );

    for (let i = 0; i < numAttributes && i < shuffledOptions.length; i++) {
      const option = shuffledOptions[i];
      const value =
        option.values[Math.floor(Math.random() * option.values.length)];

      productAttributes.push({
        id: id++,
        product_id: product.id,
        attribute_id: option.attribute_id,
        value: value,
        created_at: product.created_at,
        updated_at: new Date(),
      });
    }
  }

  return productAttributes;
};

// Generate inventory records
const generateInventory = (products, variants) => {
  const inventory = [];
  let id = 1;

  // Inventory for simple products
  for (const product of products) {
    if (product.product_type === 'simple') {
      const quantity = Math.floor(Math.random() * 500) + 10;
      const reservedQuantity = Math.floor(quantity * (Math.random() * 0.2));

      inventory.push({
        id: id++,
        product_id: product.id,
        variant_id: null,
        quantity: quantity,
        reserved_quantity: reservedQuantity,
        available_quantity: quantity - reservedQuantity,
        location: ['Warehouse A', 'Warehouse B', 'Store Front'][
          Math.floor(Math.random() * 3)
        ],
        sku: generateSku(product.vendor_id, product.store_id, product.id),
        created_at: product.created_at,
        updated_at: new Date(),
      });
    }
  }

  // Inventory for variants
  for (const variant of variants) {
    const quantity = Math.floor(Math.random() * 300) + 5;
    const reservedQuantity = Math.floor(quantity * (Math.random() * 0.15));

    inventory.push({
      id: id++,
      product_id: variant.product_id,
      variant_id: variant.id,
      quantity: quantity,
      reserved_quantity: reservedQuantity,
      available_quantity: quantity - reservedQuantity,
      location: ['Warehouse A', 'Warehouse B', 'Store Front'][
        Math.floor(Math.random() * 3)
      ],
      sku: variant.sku,
      created_at: variant.created_at,
      updated_at: new Date(),
    });
  }

  return inventory;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    // Get existing stores, sections, and vendors
    const stores = await queryInterface.sequelize.query(
      `SELECT id, vendor_id FROM stores WHERE status = 'active' LIMIT 10;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    if (stores.length === 0) {
      console.log('⚠️ No stores found. Please run store seeder first.');
      return;
    }

    const sections = await queryInterface.sequelize.query(
      `SELECT id, name, store_id FROM sections WHERE parent_id IS NOT NULL LIMIT 50;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    const vendors = await queryInterface.sequelize.query(
      `SELECT id FROM vendors LIMIT 20;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    // Generate products
    const products = await generateProducts(stores, sections, vendors);
    await queryInterface.bulkInsert('products', products, {});
    console.log(`✅ Inserted ${products.length} products`);

    // Reset product sequence
    await queryInterface.sequelize.query(
      `SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));`,
    );

    // Generate variants
    const variants = generateVariants(products);
    if (variants.length > 0) {
      await queryInterface.bulkInsert('product_variants', variants, {});
      console.log(`✅ Inserted ${variants.length} product variants`);

      await queryInterface.sequelize.query(
        `SELECT setval('product_variants_id_seq', (SELECT MAX(id) FROM product_variants));`,
      );
    }

    // Generate product images
    let allImages = [];
    let imageId = 1;

    for (const product of products) {
      const images = generateProductImages(
        product.id,
        Math.floor(Math.random() * 3) + 2,
      );
      images.forEach((img) => {
        img.id = imageId++;
        allImages.push(img);
      });
    }

    if (allImages.length > 0) {
      await queryInterface.bulkInsert('media', allImages, {});
      console.log(`✅ Inserted ${allImages.length} product images`);

      await queryInterface.sequelize.query(
        `SELECT setval('media_id_seq', (SELECT MAX(id) FROM media));`,
      );
    }

    // Generate product attributes
    const productAttributes = generateProductAttributes(products);
    if (productAttributes.length > 0) {
      await queryInterface.bulkInsert(
        'product_attributes',
        productAttributes,
        {},
      );
      console.log(`✅ Inserted ${productAttributes.length} product attributes`);

      await queryInterface.sequelize.query(
        `SELECT setval('product_attributes_id_seq', (SELECT MAX(id) FROM product_attributes));`,
      );
    }

    // Generate inventory
    const inventory = generateInventory(products, variants);
    if (inventory.length > 0) {
      await queryInterface.bulkInsert('inventories', inventory, {});
      console.log(`✅ Inserted ${inventory.length} inventory records`);

      await queryInterface.sequelize.query(
        `SELECT setval('inventories_id_seq', (SELECT MAX(id) FROM inventories));`,
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventories', null, {});
    console.log('✅ Inventory records removed');

    await queryInterface.bulkDelete('product_attributes', null, {});
    console.log('✅ Product attributes removed');

    await queryInterface.bulkDelete('media', { entity_type: 'product' }, {});
    console.log('✅ Product images removed');

    await queryInterface.bulkDelete('product_variants', null, {});
    console.log('✅ Product variants removed');

    await queryInterface.bulkDelete('products', null, {});
    console.log('✅ Products removed');

    await queryInterface.sequelize.query(
      `ALTER SEQUENCE products_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE product_variants_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE media_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE product_attributes_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE inventories_id_seq RESTART WITH 1;`,
    );
  },
};
