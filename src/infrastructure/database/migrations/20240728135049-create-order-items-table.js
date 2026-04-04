'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('order_items', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        order_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'orders',
            key: 'id',
          },
        },
        store_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'stores',
            key: 'id',
          },
        },
        product_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'products',
            key: 'id',
          },
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
          defaultValue: 0.0,
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

      // Add check constraints
      await queryInterface.sequelize.query(
        `ALTER TABLE products ADD CONSTRAINT check_price_positive CHECK (price >= 0)`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE orders ADD CONSTRAINT check_total_amount_positive CHECK (total_amount >= 0)`,
        { transaction },
      );

      await queryInterface.sequelize.query(
        `ALTER TABLE order_items ADD CONSTRAINT check_price_positive CHECK (price >= 0)`,
        { transaction },
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
  },
};
