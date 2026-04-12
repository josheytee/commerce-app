'use strict';

const { faker } = require('@faker-js/faker');

// Nigerian business categories
const BUSINESS_CATEGORIES = [
  { id: 1, name: 'Electronics', description: 'Phones, laptops, accessories' },
  { id: 2, name: 'Fashion', description: 'Clothing, shoes, accessories' },
  { id: 3, name: 'Home & Living', description: 'Furniture, decor, appliances' },
  {
    id: 4,
    name: 'Beauty & Personal Care',
    description: 'Cosmetics, skincare, grooming',
  },
  { id: 5, name: 'Food & Beverages', description: 'Groceries, drinks, snacks' },
  {
    id: 6,
    name: 'Health & Wellness',
    description: 'Supplements, fitness equipment',
  },
  { id: 7, name: 'Books & Stationery', description: 'Books, office supplies' },
  { id: 8, name: 'Toys & Games', description: 'Kids toys, games, puzzles' },
  {
    id: 9,
    name: 'Sports & Outdoors',
    description: 'Sporting goods, camping gear',
  },
  { id: 10, name: 'Automotive', description: 'Car parts, accessories' },
  { id: 11, name: 'Pet Supplies', description: 'Pet food, accessories' },
  {
    id: 12,
    name: 'Jewelry & Watches',
    description: 'Watches, jewelry, accessories',
  },
];

// Nigerian cities for vendor locations
const NIGERIAN_CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Enugu',
  'Abeokuta',
  'Onitsha',
  'Warri',
  'Jos',
  'Kaduna',
  'Maiduguri',
  'Ilorin',
  'Ogbomosho',
  'Uyo',
  'Calabar',
  'Aba',
  'Owerri',
  'Akure',
];

// Business types
const BUSINESS_TYPES = ['individual', 'registered_business'];

// Delivery options
const DELIVERY_OPTIONS = [
  'Same Day Delivery',
  'Next Day Delivery',
  'Standard Shipping (3-5 days)',
  'Express Shipping (1-2 days)',
  'Pickup Available',
  'International Shipping',
  'Door Delivery',
  'Click & Collect',
];

// Social media platforms
const SOCIAL_PLATFORMS = [
  'facebook',
  'instagram',
  'twitter',
  'tiktok',
  'linkedin',
];

// Generate random business name
const generateBusinessName = (category) => {
  const prefixes = [
    'Super',
    'Mega',
    'Global',
    'Prime',
    'Elite',
    'Royal',
    'Premium',
    'Quality',
  ];
  const suffixes = [
    'Mall',
    'Store',
    'Mart',
    'Outlet',
    'Shop',
    'Hub',
    'Center',
    'Depot',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${category.name} ${suffix}`;
};

// Generate realistic social media links (returns JSON string for JSONB)
const generateSocialMedia = (businessName) => {
  const social = {};
  const handle = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Randomly select 2-4 social platforms
  const selectedPlatforms = SOCIAL_PLATFORMS.sort(
    () => 0.5 - Math.random(),
  ).slice(0, Math.floor(Math.random() * 3) + 2);

  selectedPlatforms.forEach((platform) => {
    if (platform === 'facebook') {
      social[platform] = `https://facebook.com/${handle}`;
    } else if (platform === 'instagram') {
      social[platform] = `https://instagram.com/${handle}`;
    } else if (platform === 'twitter') {
      social[platform] = `https://twitter.com/${handle}`;
    } else if (platform === 'tiktok') {
      social[platform] = `https://tiktok.com/@${handle}`;
    } else if (platform === 'linkedin') {
      social[platform] = `https://linkedin.com/company/${handle}`;
    }
  });

  // Return as JSON string for PostgreSQL JSONB
  return JSON.stringify(social);
};

// Generate delivery options (returns PostgreSQL array format)
const generateDeliveryOptions = () => {
  const numOptions = Math.floor(Math.random() * 3) + 2; // 2-4 options
  const options = DELIVERY_OPTIONS.sort(() => 0.5 - Math.random()).slice(
    0,
    numOptions,
  );

  // PostgreSQL array format: {value1,value2,value3}
  // Escape any quotes or special characters in the strings
  const escapedOptions = options.map((opt) => opt.replace(/['"\\]/g, '\\$&'));
  return `{${escapedOptions.join(',')}}`;
};

// Generate vendor description
const generateDescription = (businessName, category) => {
  const templates = [
    `${businessName} is a leading ${category.name.toLowerCase()} retailer in Nigeria, offering quality products at affordable prices. We pride ourselves on excellent customer service and fast delivery.`,
    `Welcome to ${businessName}, your one-stop shop for all ${category.name.toLowerCase()} needs. We provide authentic products from trusted brands with warranty and after-sales support.`,
    `${businessName} has been serving customers across Nigeria with top-quality ${category.name.toLowerCase()} products. Shop with confidence and enjoy amazing discounts.`,
    `Discover the best ${category.name.toLowerCase()} deals at ${businessName}. We offer competitive prices, secure payment, and nationwide delivery. Your satisfaction is guaranteed!`,
    `${businessName} is committed to bringing you the finest ${category.name.toLowerCase()} products from around the world. Experience luxury shopping with convenience.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate short description
const generateShortDescription = (businessName, category) => {
  const templates = [
    `Your trusted ${category.name.toLowerCase()} store in Nigeria. Quality products, best prices!`,
    `Shop authentic ${category.name.toLowerCase()} products at ${businessName}. Fast delivery nationwide.`,
    `Nigeria's premier ${category.name.toLowerCase()} retailer. Shop with confidence today!`,
    `Best ${category.name.toLowerCase()} deals and discounts at ${businessName}. Order now!`,
    `${businessName} - Your favorite ${category.name.toLowerCase()} shopping destination in Nigeria.`,
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

// Generate metadata (returns JSON string for JSONB)
const generateMetadata = () => {
  const metadata = {
    years_in_business: Math.floor(Math.random() * 10) + 1,
    employees_count: Math.floor(Math.random() * 50) + 1,
    store_location:
      NIGERIAN_CITIES[Math.floor(Math.random() * NIGERIAN_CITIES.length)],
    operating_hours: {
      monday_friday: '9:00 AM - 6:00 PM',
      saturday: '10:00 AM - 4:00 PM',
      sunday: 'Closed',
    },
    payment_methods: ['Cash', 'Bank Transfer', 'Card Payment', 'POS'],
    return_policy: '30-day return policy for unused items',
    warranty_info: 'Manufacturer warranty applies',
    established_year: faker.date.past({ years: 15 }).getFullYear(),
  };

  return JSON.stringify(metadata);
};

// Generate vendor data
const generateVendors = (
  count = 50,
  existingUsers = [],
  existingCategories = [],
) => {
  const vendors = [];
  const statuses = ['active', 'pending', 'active', 'active', 'suspended']; // More active vendors
  const now = new Date();

  // Ensure we have categories
  const categories =
    existingCategories.length > 0 ? existingCategories : BUSINESS_CATEGORIES;

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const businessName = generateBusinessName(category);
    const isVerified = Math.random() > 0.3; // 70% verified
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const ratingAverage = parseFloat((Math.random() * 2 + 3).toFixed(1)); // 3.0 - 5.0
    const totalRatings = Math.floor(Math.random() * 500) + 10;
    const totalReviews = Math.floor(Math.random() * 200) + 5;

    // Assign user_id from existing users if provided, otherwise use a range
    const userId =
      existingUsers.length > 0
        ? existingUsers[Math.floor(Math.random() * existingUsers.length)]
        : Math.floor(Math.random() * 50) + 1;

    vendors.push({
      id: i,
      business_name: businessName,
      business_phone: faker.phone.number('+234 80########'),
      business_email: faker.internet.email({
        firstName: businessName.toLowerCase().replace(/\s/g, ''),
      }),
      business_type:
        BUSINESS_TYPES[Math.floor(Math.random() * BUSINESS_TYPES.length)],
      business_description: generateDescription(businessName, category),
      business_short_description: generateShortDescription(
        businessName,
        category,
      ),
      document_type: 'cac',
      document_url: faker.internet.url(),
      rating_average: ratingAverage,
      total_ratings: totalRatings,
      total_reviews: totalReviews,
      social_media: generateSocialMedia(businessName), // JSON string for JSONB
      delivery_options: generateDeliveryOptions(), // PostgreSQL array format
      status: status === 'pending' && isVerified ? 'active' : status,
      is_default: false,
      is_verified: isVerified,
      verified_at: isVerified ? faker.date.past({ years: 1 }) : null,
      tax_id: `TAX-${faker.string.alphanumeric(10).toUpperCase()}`,
      registration_number: `RC-${faker.string.numeric(8)}`,
      metadata: generateMetadata(), // JSON string for JSONB
      user_id: userId,
      category_id: category.id,
      created_at: faker.date.past({ years: 2 }),
      updated_at: now,
      deleted_at: null,
    });
  }

  return vendors;
};

// Generate featured vendor data
const generateFeaturedVendors = (baseVendors) => {
  // Select top-rated vendors as featured
  const sortedVendors = [...baseVendors].sort(
    (a, b) => b.rating_average - a.rating_average,
  );
  const featuredVendors = sortedVendors.slice(0, 10);

  // Update featured vendors
  return baseVendors.map((vendor) => ({
    ...vendor,
    is_default: featuredVendors.some((fv) => fv.id === vendor.id),
  }));
};

// Create media entries for vendors
const generateVendorMedia = (vendors) => {
  const media = [];
  let mediaId = 1;

  vendors.forEach((vendor) => {
    // Add logo
    if (Math.random() > 0.2) {
      // 80% have logo
      media.push({
        id: mediaId++,
        entity_type: 'vendor',
        entity_id: vendor.id,
        type: 'vendor_logo',
        url: faker.image.urlLoremFlickr({ category: 'business' }),
        thumbnail_url: faker.image.urlLoremFlickr({ category: 'business' }),
        is_primary: true,
        sort_order: 0,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
      });
    }

    // Add cover image
    if (Math.random() > 0.3) {
      // 70% have cover
      media.push({
        id: mediaId++,
        entity_type: 'vendor',
        entity_id: vendor.id,
        type: 'vendor_cover',
        url: faker.image.urlLoremFlickr({ category: 'store' }),
        thumbnail_url: faker.image.urlLoremFlickr({ category: 'store' }),
        is_primary: true,
        sort_order: 0,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
      });
    }

    // Add additional images (1-3)
    const additionalImages = Math.floor(Math.random() * 3);
    for (let i = 0; i < additionalImages; i++) {
      media.push({
        id: mediaId++,
        entity_type: 'vendor',
        entity_id: vendor.id,
        type: i === 0 ? 'vendor_logo' : 'vendor_cover',
        url: faker.image.urlLoremFlickr({ category: 'business' }),
        thumbnail_url: faker.image.urlLoremFlickr({ category: 'business' }),
        is_primary: false,
        sort_order: i + 1,
        created_at: vendor.created_at,
        updated_at: vendor.updated_at,
      });
    }
  });

  return media;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, get existing users and categories if needed
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    const categories = await queryInterface.sequelize.query(
      `SELECT id, name FROM categories LIMIT 20;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    const userIds = users.map((u) => u.id);
    const categoryData =
      categories.length > 0 ? categories : BUSINESS_CATEGORIES;

    // Generate 50 vendors
    let vendors = generateVendors(50, userIds, categoryData);

    // Mark some vendors as featured
    vendors = generateFeaturedVendors(vendors);

    // Insert vendors
    await queryInterface.bulkInsert('vendors', vendors, {});
    console.log(`✅ Inserted ${vendors.length} vendors`);

    // Reset sequence
    await queryInterface.sequelize.query(
      `SELECT setval('vendors_id_seq', (SELECT MAX(id) FROM vendors));`,
    );

    // Generate and insert vendor media
    const vendorMedia = generateVendorMedia(vendors);
    if (vendorMedia.length > 0) {
      await queryInterface.bulkInsert('media', vendorMedia, {});
      console.log(`✅ Inserted ${vendorMedia.length} vendor media items`);

      // Reset media sequence
      await queryInterface.sequelize.query(
        `SELECT setval('media_id_seq', (SELECT MAX(id) FROM media));`,
      );
    }

    // Additional: Create user-vendor-role relationships
    const userVendorRoles = [];
    let mappingId = 1;

    for (const vendor of vendors) {
      // Assign vendor owner role (role_id = 10 for vendor_owner)
      if (vendor.user_id) {
        userVendorRoles.push({
          id: mappingId++,
          user_id: vendor.user_id,
          vendor_id: vendor.id,
          role_id: 10, // vendor_owner
          created_at: vendor.created_at,
          updated_at: vendor.updated_at,
        });
      }

      // Occasionally add additional staff (store managers, etc.)
      if (Math.random() > 0.7 && vendor.user_id) {
        // Find another user to be staff (in production, you'd have more users)
        const otherUser = userIds.find((id) => id !== vendor.user_id);
        if (otherUser) {
          userVendorRoles.push({
            id: mappingId++,
            user_id: otherUser,
            vendor_id: vendor.id,
            role_id: 21, // store_manager
            created_at: vendor.created_at,
            updated_at: vendor.updated_at,
          });
        }
      }
    }

    if (userVendorRoles.length > 0) {
      await queryInterface.bulkInsert('user_vendor_roles', userVendorRoles, {});
      console.log(
        `✅ Inserted ${userVendorRoles.length} user-vendor-role mappings`,
      );

      // Reset sequence for user_vendor_roles
      await queryInterface.sequelize.query(
        `SELECT setval('user_vendor_roles_id_seq', (SELECT MAX(id) FROM user_vendor_roles));`,
      );
    }
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order (due to foreign key constraints)
    await queryInterface.bulkDelete('user_vendor_roles', null, {});
    console.log('✅ User-vendor-role mappings removed');

    await queryInterface.bulkDelete('media', { entity_type: 'vendor' }, {});
    console.log('✅ Vendor media removed');

    await queryInterface.bulkDelete('vendors', null, {});
    console.log('✅ Vendors removed');

    // Reset sequences
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE vendors_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE user_vendor_roles_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE media_id_seq RESTART WITH 1;`,
    );
  },
};
