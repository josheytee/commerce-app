'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_fulfillments_type" AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'assigned');
    `);

    await queryInterface.createTable('fulfillment_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tracking_number: {
        type: Sequelize.STRING(),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          'pending',
          'processing',
          'shipped',
          'delivered',
          'assigned',
        ),
        allowNull: false,
      },
      fulfillment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'riders',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('fulfillments');
  },
};
