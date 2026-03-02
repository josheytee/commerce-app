'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      address_type: {
        type: Sequelize.ENUM('shipping', 'billing', 'both'),
        defaultValue: 'both',
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'e.g., Home, Office, etc.',
      },
      first_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: false,
        field: 'address',
      },
      address_line2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'address2',
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
        field: 'postal_code',
      },
      po_box: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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

    // Add indexes
    await queryInterface.addIndex('addresses', ['customer_id']);
    await queryInterface.addIndex('addresses', ['city_id']);
    await queryInterface.addIndex('addresses', ['state_id']);
    await queryInterface.addIndex('addresses', ['country_id']);
    await queryInterface.addIndex('addresses', ['postal_code']);
    await queryInterface.addIndex('addresses', ['is_default']);
    await queryInterface.addIndex('addresses', ['address_type']);

    // Composite indexes for common queries
    await queryInterface.addIndex('addresses', ['customer_id', 'is_default'], {
      name: 'idx_addresses_customer_default',
    });

    await queryInterface.addIndex(
      'addresses',
      ['customer_id', 'address_type'],
      {
        name: 'idx_addresses_customer_type',
      },
    );

    // Unique constraint to ensure only one default address per customer
    await queryInterface.addConstraint('addresses', {
      fields: ['customer_id', 'is_default'],
      type: 'unique',
      name: 'unique_customer_default_address',
      where: {
        is_default: true,
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop enum type first
    await queryInterface.dropTable('addresses');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_addresses_address_type',
    );
  },
};
