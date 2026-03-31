// migrations/YYYYMMDDHHMMSS-create-addresses.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Polymorphic fields
      addressable_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      addressable_type: {
        type: Sequelize.ENUM('customer', 'store'),
        allowNull: false,
      },
      // Address fields
      address_type: {
        type: Sequelize.ENUM(
          'shipping',
          'billing',
          'both',
          'physical',
          'postal',
        ),
        defaultValue: 'both',
      },
      label: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'e.g., Home, Office, Main Store, Warehouse',
      },
      contact_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Person of contact at this address',
      },
      contact_phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      address_line2: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      landmark: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      city_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'cities',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      po_box: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Default address for this entity',
      },
      is_primary_store: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'For stores - is this the primary location',
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      delivery_instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Indexes for polymorphic queries
    await queryInterface.addIndex(
      'addresses',
      ['addressable_id', 'addressable_type'],
      {
        name: 'idx_addresses_polymorphic',
      },
    );

    // Individual indexes
    await queryInterface.addIndex('addresses', ['addressable_type']);
    await queryInterface.addIndex('addresses', ['city_id']);
    await queryInterface.addIndex('addresses', ['state_id']);
    await queryInterface.addIndex('addresses', ['country_id']);
    await queryInterface.addIndex('addresses', ['postal_code']);
    await queryInterface.addIndex('addresses', ['is_default']);
    await queryInterface.addIndex('addresses', ['address_type']);

    // Composite indexes for common queries
    await queryInterface.addIndex(
      'addresses',
      ['addressable_id', 'addressable_type', 'is_default'],
      {
        name: 'idx_addresses_entity_default',
      },
    );

    await queryInterface.addIndex(
      'addresses',
      ['addressable_id', 'addressable_type', 'address_type'],
      {
        name: 'idx_addresses_entity_type',
      },
    );

    // For store primary location
    await queryInterface.addIndex(
      'addresses',
      ['addressable_id', 'addressable_type', 'is_primary_store'],
      {
        name: 'idx_addresses_store_primary',
        where: {
          addressable_type: 'store',
          is_primary_store: true,
          deleted_at: null,
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addresses');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_addresses_addressable_type',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_addresses_address_type',
    );
  },
};
