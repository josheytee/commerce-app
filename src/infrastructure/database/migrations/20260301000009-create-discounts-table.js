'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_discounts_type" AS ENUM ('percentage', 'fixed', 'buy_x_get_y', 'free_shipping');
    `);

    await queryInterface.createTable('discounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
      },
      type: {
        type: Sequelize.ENUM(
          'percentage',
          'fixed',
          'buy_x_get_y',
          'free_shipping',
        ),
        allowNull: false,
      },
      value: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      buy_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      get_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      min_order_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      max_order_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      entity_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      customer_eligibility: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      used_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      usage_per_customer: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_public: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      stackable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('discounts', ['entity_type', 'entity_id'], {
      name: 'discounts_entity_idx',
    });
    await queryInterface.addIndex('discounts', ['code'], {
      name: 'discounts_code_idx',
      unique: true,
    });
    await queryInterface.addIndex('discounts', ['start_date', 'end_date'], {
      name: 'discounts_dates_idx',
    });
    await queryInterface.addIndex('discounts', ['is_active'], {
      name: 'discounts_active_idx',
    });
    await queryInterface.addIndex('discounts', ['type'], {
      name: 'discounts_type_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('discounts');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_discounts_type";',
    );
  },
};
