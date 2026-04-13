'use strict';

const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// User roles mapping
const USER_ROLES = {
  super_admin: 1,
  platform_manager: 2,
  support_agent: 3,
  vendor_owner: 10,
  vendor_admin: 11,
  vendor_manager: 12,
  store_owner: 20,
  store_manager: 21,
  store_staff: 22,
  customer: 70,
  premium_customer: 71,
};

// Nigerian phone number prefixes
const PHONE_PREFIXES = [
  '080',
  '081',
  '070',
  '090',
  '091',
  '0803',
  '0806',
  '0813',
  '0816',
  '0903',
];

// Generate Nigerian phone number
const generatePhoneNumber = () => {
  const prefix =
    PHONE_PREFIXES[Math.floor(Math.random() * PHONE_PREFIXES.length)];
  const suffix = Math.floor(Math.random() * 10000000)
    .toString()
    .padStart(7, '0');
  return `${prefix}${suffix}`;
};

// Generate username
const generateUsername = (firstName, lastName) => {
  const base = `${firstName}.${lastName}`.toLowerCase();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${base}${randomNum}`;
};

// Generate email
const generateEmail = (firstName, lastName) => {
  const domains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'example.com',
    'ojalanta.com',
  ];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@${domain}`;
};

// Generate random date of birth (18-80 years old)
const generateDOB = () => {
  const minAge = 18;
  const maxAge = 80;
  const age = Math.floor(Math.random() * (maxAge - minAge + 1) + minAge);
  const year = new Date().getFullYear() - age;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
};

// Generate users
const generateUsers = (count = 100) => {
  const users = [];
  const genders = ['male', 'female'];
  const statuses = ['active', 'inactive', 'suspended'];

  // Create super admin
  users.push({
    id: 1,
    username: 'super.admin',
    password_hash: bcrypt.hashSync('Admin@123', 10),
    email: 'superadmin@ojalanta.com',
    first_name: 'Super',
    last_name: 'Admin',
    gender: 'male',
    phone_number: '08012345678',
    dob: new Date('1985-01-01'),
    verified_at: new Date(),
    last_login: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  });

  // Create platform managers
  for (let i = 0; i < 3; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      id: users.length + 1,
      username: generateUsername(firstName, lastName),
      password_hash: bcrypt.hashSync('Manager@123', 10),
      email: generateEmail(firstName, lastName),
      first_name: firstName,
      last_name: lastName,
      gender: genders[Math.floor(Math.random() * genders.length)],
      phone_number: generatePhoneNumber(),
      dob: generateDOB(),
      verified_at: new Date(),
      last_login: faker.date.recent(),
      created_at: faker.date.past({ years: 2 }),
      updated_at: new Date(),
      deleted_at: null,
    });
  }

  // Create support agents
  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      id: users.length + 1,
      username: generateUsername(firstName, lastName),
      password_hash: bcrypt.hashSync('Support@123', 10),
      email: generateEmail(firstName, lastName),
      first_name: firstName,
      last_name: lastName,
      gender: genders[Math.floor(Math.random() * genders.length)],
      phone_number: generatePhoneNumber(),
      dob: generateDOB(),
      verified_at: new Date(),
      last_login: faker.date.recent(),
      created_at: faker.date.past({ years: 2 }),
      updated_at: new Date(),
      deleted_at: null,
    });
  }

  // Create vendor owners and staff
  const vendorOwnersCount = Math.floor(count * 0.3); // 30% vendor owners
  for (let i = 0; i < vendorOwnersCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    users.push({
      id: users.length + 1,
      username: generateUsername(firstName, lastName),
      password_hash: bcrypt.hashSync('Vendor@123', 10),
      email: generateEmail(firstName, lastName),
      first_name: firstName,
      last_name: lastName,
      gender: genders[Math.floor(Math.random() * genders.length)],
      phone_number: generatePhoneNumber(),
      dob: generateDOB(),
      verified_at: status === 'active' ? new Date() : null,
      last_login: faker.date.recent(),
      created_at: faker.date.past({ years: 1 }),
      updated_at: new Date(),
      deleted_at: null,
    });
  }

  // Create regular customers
  const customersCount = count - users.length;
  for (let i = 0; i < customersCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const isVerified = Math.random() > 0.3;
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    users.push({
      id: users.length + 1,
      username: generateUsername(firstName, lastName),
      password_hash: bcrypt.hashSync('Customer@123', 10),
      email: generateEmail(firstName, lastName),
      first_name: firstName,
      last_name: lastName,
      gender: genders[Math.floor(Math.random() * genders.length)],
      phone_number: generatePhoneNumber(),
      dob: generateDOB(),
      verified_at: isVerified ? new Date() : null,
      last_login: Math.random() > 0.5 ? faker.date.recent() : null,
      created_at: faker.date.past({ years: 1 }),
      updated_at: new Date(),
      deleted_at: null,
    });
  }

  return users;
};

// Generate customers (extends user data)
const generateCustomers = (users, existingCustomerIds = []) => {
  const customers = [];
  let customerId = 1;

  // Filter users who are customers (not admins or vendors)
  const customerUsers = users.filter(
    (user) =>
      user.id > 9 && // Skip super admin and platform managers
      !user.username.includes('vendor'), // Skip vendor users
  );

  // Also include vendor users as customers (they can also shop)
  const vendorUsers = users.filter((user) => user.username.includes('vendor'));

  const allCustomerUsers = [...customerUsers, ...vendorUsers];

  for (const user of allCustomerUsers) {
    // Skip if already has a customer record
    if (existingCustomerIds.includes(user.id)) continue;

    const status = ['active', 'active', 'active', 'inactive', 'suspended'][
      Math.floor(Math.random() * 5)
    ];

    customers.push({
      id: customerId++,
      user_id: user.id,
      default_address_id: null, // Will be updated later if addresses exist
      status: status,
      created_at: user.created_at,
      updated_at: new Date(),
    });
  }

  return customers;
};

// Generate user-vendor-role mappings
const generateUserVendorRoles = (users, vendors) => {
  const mappings = [];
  let id = 1;

  // Map vendor owners to their vendors
  const vendorOwners = users.filter((user) => user.username.includes('vendor'));

  for (let i = 0; i < vendorOwners.length && i < vendors.length; i++) {
    // Assign vendor owner role
    mappings.push({
      id: id++,
      user_id: vendorOwners[i].id,
      vendor_id: vendors[i].id,
      role_id: USER_ROLES.vendor_owner,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Occasionally add additional staff for the vendor
    if (Math.random() > 0.6 && i + 1 < users.length) {
      const staffUser = users.find(
        (u) => !u.username.includes('vendor') && u.id > 10,
      );
      if (staffUser) {
        const staffRoles = [
          USER_ROLES.vendor_admin,
          USER_ROLES.vendor_manager,
          USER_ROLES.store_manager,
        ];
        const roleId =
          staffRoles[Math.floor(Math.random() * staffRoles.length)];

        mappings.push({
          id: id++,
          user_id: staffUser.id,
          vendor_id: vendors[i].id,
          role_id: roleId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
  }

  return mappings;
};

// Generate user-store-role mappings
const generateUserStoreRoles = (users, stores) => {
  const mappings = [];
  let id = 1;

  for (const store of stores) {
    // Find users associated with this store's vendor
    const vendorUsers = users.filter((user) =>
      user.username.includes('vendor'),
    );

    if (vendorUsers.length > 0) {
      // Assign store owner
      mappings.push({
        id: id++,
        user_id: vendorUsers[Math.floor(Math.random() * vendorUsers.length)].id,
        store_id: store.id,
        role_id: USER_ROLES.store_owner,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Add store manager
      const managerUser = users.find(
        (u) => !u.username.includes('vendor') && u.id > 10,
      );
      if (managerUser && Math.random() > 0.5) {
        mappings.push({
          id: id++,
          user_id: managerUser.id,
          store_id: store.id,
          role_id: USER_ROLES.store_manager,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }

      // Add store staff
      if (Math.random() > 0.7) {
        const staffUser = users.find(
          (u) => u.id > 15 && !mappings.some((m) => m.user_id === u.id),
        );
        if (staffUser) {
          mappings.push({
            id: id++,
            user_id: staffUser.id,
            store_id: store.id,
            role_id: USER_ROLES.store_staff,
            created_at: new Date(),
            updated_at: new Date(),
          });
        }
      }
    }
  }

  return mappings;
};

// Generate audit logs
const generateAuditLogs = (users, count = 500) => {
  const logs = [];
  const actions = [
    'LOGIN',
    'LOGOUT',
    'CREATE',
    'UPDATE',
    'DELETE',
    'VIEW',
    'EXPORT',
    'APPROVE',
    'REJECT',
    'SUSPEND',
    'ACTIVATE',
    'PASSWORD_CHANGE',
  ];
  const entities = [
    'USER',
    'PRODUCT',
    'ORDER',
    'VENDOR',
    'STORE',
    'CONTRIBUTION',
    'PROGRAM',
    'CUSTOMER',
    'INVENTORY',
    'SETTINGS',
  ];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const entity = entities[Math.floor(Math.random() * entities.length)];

    logs.push({
      id: i + 1,
      user_id: user.id,
      action: action,
      entity_type: entity,
      entity_id: Math.floor(Math.random() * 1000) + 1,
      old_values: Math.random() > 0.7 ? { status: 'old' } : null,
      new_values: { status: 'new' },
      ip_address: faker.internet.ip(),
      user_agent: faker.internet.userAgent(),
      created_at: faker.date.past({ years: 1 }),
    });
  }

  return logs;
};

// Generate sessions
const generateSessions = (users, count = 200) => {
  const sessions = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    sessions.push({
      id: i + 1,
      user_id: user.id,
      token: faker.string.uuid(),
      ip_address: faker.internet.ip(),
      user_agent: faker.internet.userAgent(),
      payload: {},
      last_activity: faker.date.recent(),
      expires_at: expiresAt,
      created_at: faker.date.past({ days: 30 }),
      updated_at: new Date(),
    });
  }

  return sessions;
};

// Generate password resets
const generatePasswordResets = (users, count = 50) => {
  const resets = [];

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    resets.push({
      id: i + 1,
      user_id: user.id,
      token: faker.string.uuid(),
      expires_at: expiresAt,
      created_at: faker.date.past({ days: 60 }),
      updated_at: new Date(),
    });
  }

  return resets;
};

module.exports = {
  async up(queryInterface, Sequelize) {
    // Generate users
    const users = generateUsers(150);
    await queryInterface.bulkInsert('users', users, {});
    console.log(`✅ Inserted ${users.length} users`);

    // Reset user sequence
    await queryInterface.sequelize.query(
      `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));`,
    );

    // Get existing vendors for role mapping
    const vendors = await queryInterface.sequelize.query(
      `SELECT id FROM vendors LIMIT 50;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    // Generate user-vendor-role mappings
    if (vendors.length > 0) {
      const userVendorRoles = generateUserVendorRoles(users, vendors);
      if (userVendorRoles.length > 0) {
        await queryInterface.bulkInsert(
          'user_vendor_roles',
          userVendorRoles,
          {},
        );
        console.log(
          `✅ Inserted ${userVendorRoles.length} user-vendor-role mappings`,
        );

        // Reset sequence
        await queryInterface.sequelize.query(
          `SELECT setval('user_vendor_roles_id_seq', (SELECT MAX(id) FROM user_vendor_roles));`,
        );
      }
    }

    // Get existing stores for role mapping
    const stores = await queryInterface.sequelize.query(
      `SELECT id FROM stores LIMIT 30;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );

    // Generate user-store-role mappings
    if (stores.length > 0) {
      const userStoreRoles = generateUserStoreRoles(users, stores);
      if (userStoreRoles.length > 0) {
        await queryInterface.bulkInsert('user_store_roles', userStoreRoles, {});
        console.log(
          `✅ Inserted ${userStoreRoles.length} user-store-role mappings`,
        );

        // Reset sequence
        await queryInterface.sequelize.query(
          `SELECT setval('user_store_roles_id_seq', (SELECT MAX(id) FROM user_store_roles));`,
        );
      }
    }

    // Generate customers
    const existingCustomers = await queryInterface.sequelize.query(
      `SELECT user_id FROM customers;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT },
    );
    const existingCustomerIds = existingCustomers.map((c) => c.user_id);

    const customers = generateCustomers(users, existingCustomerIds);
    if (customers.length > 0) {
      await queryInterface.bulkInsert('customers', customers, {});
      console.log(`✅ Inserted ${customers.length} customers`);

      // Reset customer sequence
      await queryInterface.sequelize.query(
        `SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));`,
      );
    }

    // Generate sessions
    const sessions = generateSessions(users, 300);
    await queryInterface.bulkInsert('sessions', sessions, {});
    console.log(`✅ Inserted ${sessions.length} sessions`);

    // Reset session sequence
    await queryInterface.sequelize.query(
      `SELECT setval('sessions_id_seq', (SELECT MAX(id) FROM sessions));`,
    );

    // Generate password resets
    const passwordResets = generatePasswordResets(users, 100);
    await queryInterface.bulkInsert('password_resets', passwordResets, {});
    console.log(`✅ Inserted ${passwordResets.length} password resets`);

    // Reset password_resets sequence
    await queryInterface.sequelize.query(
      `SELECT setval('password_resets_id_seq', (SELECT MAX(id) FROM password_resets));`,
    );

    // Generate audit logs
    const auditLogs = generateAuditLogs(users, 1000);
    await queryInterface.bulkInsert('audit_logs', auditLogs, {});
    console.log(`✅ Inserted ${auditLogs.length} audit logs`);

    // Reset audit_logs sequence
    await queryInterface.sequelize.query(
      `SELECT setval('audit_logs_id_seq', (SELECT MAX(id) FROM audit_logs));`,
    );
  },

  async down(queryInterface, Sequelize) {
    // Delete in reverse order (due to foreign key constraints)
    await queryInterface.bulkDelete('audit_logs', null, {});
    console.log('✅ Audit logs removed');

    await queryInterface.bulkDelete('password_resets', null, {});
    console.log('✅ Password resets removed');

    await queryInterface.bulkDelete('sessions', null, {});
    console.log('✅ Sessions removed');

    await queryInterface.bulkDelete('user_store_roles', null, {});
    console.log('✅ User-store-role mappings removed');

    await queryInterface.bulkDelete('user_vendor_roles', null, {});
    console.log('✅ User-vendor-role mappings removed');

    await queryInterface.bulkDelete('customers', null, {});
    console.log('✅ Customers removed');

    await queryInterface.bulkDelete('users', null, {});
    console.log('✅ Users removed');

    // Reset sequences
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE users_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE customers_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE sessions_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE password_resets_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE audit_logs_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE user_vendor_roles_id_seq RESTART WITH 1;`,
    );
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE user_store_roles_id_seq RESTART WITH 1;`,
    );
  },
};
