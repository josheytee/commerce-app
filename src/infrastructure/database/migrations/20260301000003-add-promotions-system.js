'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create promotions table
      await queryInterface.createTable(
        'promotions',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'stores',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          description: Sequelize.TEXT,
          type: {
            type: Sequelize.ENUM('percentage', 'fixed', 'bogo'),
            allowNull: false,
          },
          value: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          start_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          end_date: Sequelize.DATE,
          max_uses: Sequelize.INTEGER,
          current_uses: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          min_order_amount: Sequelize.DECIMAL(10, 2),
          is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Create product_promotions junction table
      await queryInterface.createTable(
        'product_promotions',
        {
          product_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'products',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
          },
          promotion_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'promotions',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            primaryKey: true,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction },
      );

      // Add indexes
      await queryInterface.addIndex('promotions', ['store_id', 'is_active'], {
        transaction,
      });
      await queryInterface.addIndex('promotions', ['start_date', 'end_date'], {
        transaction,
      });
      await queryInterface.addIndex('product_promotions', ['promotion_id'], {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('product_promotions', { transaction });
      await queryInterface.dropTable('promotions', { transaction });
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS enum_promotions_type',
        { transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
