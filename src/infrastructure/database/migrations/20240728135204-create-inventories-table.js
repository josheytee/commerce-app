// migrations/YYYYMMDDHHMMSS-create-inventories-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM for stock status
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_inventories_stock_status" AS ENUM ('in_stock', 'out_of_stock', 'backorder', 'pre_order', 'low_stock');
    `);

    await queryInterface.createTable('inventories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'stores',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      product_variant_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'product_variants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      stock_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      stock_status: {
        type: Sequelize.ENUM(
          'in_stock',
          'out_of_stock',
          'backorder',
          'pre_order',
          'low_stock',
        ),
        defaultValue: 'in_stock',
      },
      low_stock_threshold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      reserved_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      track_quantity: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      allow_backorders: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    });

    // Add indexes
    await queryInterface.addIndex('inventories', ['product_id'], {
      name: 'inventories_product_idx',
    });
    await queryInterface.addIndex('inventories', ['product_variant_id'], {
      name: 'inventories_variant_idx',
    });
    await queryInterface.addIndex('inventories', ['store_id'], {
      name: 'inventories_store_idx',
    });
    await queryInterface.addIndex('inventories', ['stock_status'], {
      name: 'inventories_status_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inventories');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_inventories_stock_status";',
    );
  },
};
