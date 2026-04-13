'use strict';

const { faker } = require('@faker-js/faker');

// Nigerian states and cities data
const NIGERIAN_STATES = [
  { id: 1, name: 'Lagos', capital: 'Ikeja' },
  { id: 2, name: 'Abuja FCT', capital: 'Abuja' },
  { id: 3, name: 'Rivers', capital: 'Port Harcourt' },
  { id: 4, name: 'Kano', capital: 'Kano' },
  { id: 5, name: 'Oyo', capital: 'Ibadan' },
  { id: 6, name: 'Edo', capital: 'Benin City' },
  { id: 7, name: 'Enugu', capital: 'Enugu' },
  { id: 8, name: 'Ogun', capital: 'Abeokuta' },
  { id: 9, name: 'Delta', capital: 'Asaba' },
  { id: 10, name: 'Anambra', capital: 'Awka' },
];

const NIGERIAN_CITIES = {
  1: [
    'Ikeja',
    'Victoria Island',
    'Lekki',
    'Surulere',
    'Yaba',
    'Ikorodu',
    'Badagry',
  ],
  2: ['Garki', 'Wuse', 'Maitama', 'Jabi', 'Kubwa', 'Gwagwalada'],
  3: ['Port Harcourt', 'Rumuokoro', 'Eleme', 'Trans Amadi', 'GRA'],
  4: ['Kano', 'Ungogo', 'Gwale', 'Fagge', 'Dala'],
  5: ['Ibadan', 'Oyo', 'Ogbomosho', 'Oyo Town', 'Saki'],
  6: ['Benin City', 'Uromi', 'Ekpoma', 'Auchi', 'Irrua'],
  7: ['Enugu', 'Nsukka', 'Awgu', 'Udi', 'Oji River'],
  8: ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ifo', 'Ota'],
  9: ['Asaba', 'Warri', 'Sapele', 'Ughelli', 'Agbor'],
  10: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia', 'Ihiala'],
};

// Store name prefixes and suffixes
const STORE_PREFIXES = [
  'Super',
  'Mega',
  'Elite',
  'Premium',
  'Royal',
  'Prime',
  'Global',
  'Quality',
  'Best',
  'Top',
  'Ultra',
  'Max',
  'Pro',
  'Smart',
  'Express',
  'Plus',
];

const STORE_SUFFIXES = [
  'Store',
  'Shop',
  'Mart',
  'Outlet',
  'Hub',
  'Center',
  'Depot',
  'Market',
  'Emporium',
  'Boutique',
  'Gallery',
  'Zone',
  'Place',
  'Corner',
  'Spot',
];

// Store name themes by vendor category
const STORE_THEMES = {
  Electronics: [
    'Tech',
    'Gadget',
    'Digital',
    'Computer',
    'Phone',
    'Device',
    'Gaming',
  ],
  Fashion: [
    'Style',
    'Trend',
    'Wear',
    'Clothing',
    'Apparel',
    'Attire',
    'Fashion',
  ],
  'Home & Living': [
    'Home',
    'Living',
    'Decor',
    'Furniture',
    'Interior',
    'Space',
  ],
  'Beauty & Personal Care': [
    'Beauty',
    'Glow',
    'Care',
    'Spa',
    'Cosmetics',
    'Skincare',
  ],
  'Food & Beverages': [
    'Food',
    'Taste',
    'Flavor',
    'Fresh',
    'Market',
    'Groceries',
  ],
  'Health & Wellness': ['Health', 'Wellness', 'Fit', 'Active', 'Vital', 'Care'],
  'Books & Stationery': ['Book', 'Read', 'Page', 'Story', 'Knowledge', 'Learn'],
  'Toys & Games': ['Toy', 'Play', 'Fun', 'Game', 'Kid', 'Joy', 'Wonder'],
  'Sports & Outdoors': [
    'Sport',
    'Fitness',
    'Active',
    'Outdoor',
    'Adventure',
    'Gear',
  ],
  Automotive: ['Auto', 'Drive', 'Car', 'Vehicle', 'Motor', 'Wheel', 'Speed'],
  'Pet Supplies': ['Pet', 'Paw', 'Animal', 'Critter', 'Furry', 'Tail'],
  'Jewelry & Watches': ['Jewel', 'Time', 'Watch', 'Diamond', 'Gold', 'Luxury'],
};

// Generate store name
const generateStoreName = (vendor, index) => {
  const vendorCategory = vendor.category_name || 'Store';
  const theme = STORE_THEMES[vendorCategory] || ['Store'];
  const prefix =
    STORE_PREFIXES[Math.floor(Math.random() * STORE_PREFIXES.length)];
  const themeWord = theme[Math.floor(Math.random() * theme.length)];
  const suffix =
    STORE_SUFFIXES[Math.floor(Math.random() * STORE_SUFFIXES.length)];

  const patterns = [
    `${prefix} ${themeWord} ${suffix}`,
    `${themeWord} ${suffix}`,
    `${vendor.business_name.split(' ')[0]} ${themeWord}`,
    `${themeWord} by ${vendor.business_name.split(' ')[0]}`,
  ];

  return patterns[Math.floor(Math.random() * patterns.length)];
};

// Generate store slug
const generateSlug = (name, vendorId, storeIndex) => {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${baseSlug}-${vendorId}-${storeIndex}`;
};

// Generate store description
const generateStoreDescription = (name, vendor) => {
  const templates = [
    `${name} is your premier destination for quality products in Nigeria. We offer authentic items at competitive prices with excellent customer service.`,
    `Welcome to ${name}, where we bring you the best selections from around the world. Shop with confidence and enjoy fast delivery nationwide.`,
    `${name} has been serving customers across Nigeria with top-quality products. We pride ourselves on authenticity and customer satisfaction.`,
    `Discover amazing deals at ${name}. We offer competitive prices, secure payment options, and reliable delivery to your doorstep.`,
    `${name} - Your trusted store in Nigeria. Quality products, best prices, and exceptional service guaranteed.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate meta description
const generateMetaDescription = (name) => {
  const templates = [
    `Shop the best products at ${name}. Quality items, competitive prices, and fast delivery across Nigeria. Order now!`,
    `${name} - Your one-stop shop for premium products in Nigeria. Browse our collection and enjoy amazing discounts today.`,
    `Find authentic products at ${name}. We offer secure payment, nationwide delivery, and excellent customer support.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate tags (PostgreSQL array format)
const generateTags = (vendorCategory) => {
  const baseTags = [
    vendorCategory.toLowerCase(),
    'nigeria',
    'online shopping',
    'quality products',
  ];
  const additionalTags = [
    'best prices',
    'fast delivery',
    'authentic',
    'trusted store',
    'sale',
    'discount',
  ];

  const numTags = Math.floor(Math.random() * 4) + 3;
  const allTags = [...baseTags, ...additionalTags];
  const selectedTags = allTags
    .sort(() => 0.5 - Math.random())
    .slice(0, numTags);

  // Return PostgreSQL array format
  return `{${selectedTags.join(',')}}`;
};

// Generate address for store
const generateStoreAddress = (storeId, vendorId, storeIndex) => {
  const stateId = Math.floor(Math.random() * NIGERIAN_STATES.length) + 1;
  const state = NIGERIAN_STATES.find((s) => s.id === stateId);
  const cities = NIGERIAN_CITIES[stateId] || NIGERIAN_CITIES[1];
  const city = cities[Math.floor(Math.random() * cities.length)];

  const streetNames = [
    'Main Road',
    'Market Street',
    'Commercial Avenue',
    'Business District',
    'Shopping Complex',
    'Plaza Road',
  ];
  const streetName =
    streetNames[Math.floor(Math.random() * streetNames.length)];
  const buildingNumber = Math.floor(Math.random() * 200) + 1;

  return {
    addressable_id: storeId,
    addressable_type: 'store',
    address_type: Math.random() > 0.3 ? 'both' : 'physical',
    label: ['Main Store', 'Warehouse', 'Head Office', 'Branch', 'Outlet'][
      Math.floor(Math.random() * 5)
    ],
    contact_name: `Store Manager - ${storeIndex}`,
    contact_phone: faker.phone.number('+234 80########'),
    address_line1: `${buildingNumber} ${streetName}`,
    address_line2:
      Math.random() > 0.5
        ? `Suite ${Math.floor(Math.random() * 100) + 1}`
        : null,
    landmark: [
      'Near City Mall',
      'Opposite Central Bank',
      'Beside Police Station',
      'Next to Hospital',
    ][Math.floor(Math.random() * 4)],
    city_id: stateId,
    city: city,
    state_id: stateId,
    country_id: 1, // Nigeria
    postal_code: faker.location.zipCode(),
    po_box:
      Math.random() > 0.7
        ? `PO Box ${Math.floor(Math.random() * 10000)}`
        : null,
    is_default: false,
    is_primary_store: true,
    is_verified: Math.random() > 0.2,
    delivery_instructions: Math.random() > 0.5 ? 'Call before delivery' : null,
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    created_at: new Date(),
    updated_at: new Date(),
  };
};

// Generate addresses for stores
const generateAddresses = (stores) => {
  const addresses = [];
  let addressId = 1;

  for (const store of stores) {
    // Each store has 1-3 addresses
    const numAddresses = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numAddresses; i++) {
      const address = generateStoreAddress(store.id, store.vendor_id, i + 1);
      address.id = addressId++;

      // Set first address as default
      if (i === 0) {
        address.is_default = true;
      }

      addresses.push(address);
    }
  }

  return addresses;
};

// Generate stores
const generateStores = async (queryInterface, limit = 30) => {
  // Get existing vendors
  const vendors = await queryInterface.sequelize.query(
    `SELECT v.id, v.business_name, c.name as category_name 
     FROM vendors v
     LEFT JOIN categories c ON v.category_id = c.id
     WHERE v.status = 'active' 
     LIMIT ${limit};`,
    { type: queryInterface.sequelize.QueryTypes.SELECT },
  );

  if (vendors.length === 0) {
    console.log('⚠️ No vendors found. Please run vendor seeder first.');
    return { stores: [], addresses: [] };
  }

  const stores = [];
  const statuses = ['active', 'active', 'active', 'inactive', 'suspended'];
  let storeId = 1;

  for (const vendor of vendors) {
    // Each vendor can have 1-3 stores
    const numStores = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < numStores; i++) {
      const storeName = generateStoreName(vendor, i);
      const slug = generateSlug(storeName, vendor.id, i);
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const isVerified = status === 'active' && Math.random() > 0.3;
      const isFeatured = isVerified && Math.random() > 0.8;

      stores.push({
        id: storeId++,
        name: storeName,
        description: generateStoreDescription(storeName, vendor),
        vendor_id: vendor.id,
        address_id: null, // Will be updated after addresses are created
        slug: slug,
        meta_title: `${storeName} - Best ${vendor.category_name || 'Products'} Store in Nigeria`,
        meta_description: generateMetaDescription(storeName),
        tags: generateTags(vendor.category_name || 'Store'),
        status: status,
        is_verified: isVerified,
        is_featured: isFeatured,
        created_at: faker.date.past({ years: 1 }),
        updated_at: new Date(),
        deleted_at: null,
      });
    }
  }

  return { stores, vendors };
};

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate stores first
    const { stores, vendors } = await generateStores(queryInterface, 30);

    if (stores.length === 0) {
      console.log('⚠️ No stores generated. Exiting seeder.');
      return;
    }

    // Insert stores
    await queryInterface.bulkInsert('stores', stores, {});
    console.log(`✅ Inserted ${stores.length} stores`);

    // Reset store sequence
    await queryInterface.sequelize.query(
      `SELECT setval('stores_id_seq', (SELECT MAX(id) FROM stores));`,
    );

    // Generate addresses for stores
    const addresses = generateAddresses(stores);

    if (addresses.length > 0) {
      await queryInterface.bulkInsert('addresses', addresses, {});
      console.log(`✅ Inserted ${addresses.length} store addresses`);

      // Reset address sequence
      await queryInterface.sequelize.query(
        `SELECT setval('addresses_id_seq', (SELECT MAX(id) FROM addresses));`,
      );

      // Update stores with their primary address_id
      for (const store of stores) {
        const primaryAddress = addresses.find(
          (addr) =>
            addr.addressable_id === store.id && addr.is_primary_store === true,
        );

        if (primaryAddress) {
          await queryInterface.sequelize.query(
            `UPDATE stores SET address_id = ${primaryAddress.id} WHERE id = ${store.id};`,
          );
        }
      }
      console.log(`✅ Updated stores with address references`);
    }

    // Create indexes for addresses (if not already created by migration)
    try {
      await queryInterface.addIndex(
        'addresses',
        ['addressable_id', 'addressable_type'],
        {
          name: 'idx_addresses_polymorphic',
        },
      );
    } catch (error) {
      // Index might already exist
      console.log('Note: Some indexes may already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order
    await queryInterface.bulkDelete(
      'addresses',
      { addressable_type: 'store' },
      {},
    );
    console.log('✅ Store addresses removed');

    await queryInterface.bulkDelete('stores', null, {});
    console.log('✅ Stores removed');

    // Reset sequences
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE stores_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE addresses_id_seq RESTART WITH 1;`,
    );
  },
};
