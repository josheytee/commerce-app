'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      attributes: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      compare_at_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      length: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      requires_shipping: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      shipping_class: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
    });

    // Add indexes
    await queryInterface.addIndex('product_variants', ['product_id'], {
      name: 'variants_product_id_idx',
    });
    await queryInterface.addIndex('product_variants', ['sku'], {
      name: 'variants_sku_idx',
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_variants');
  },
};