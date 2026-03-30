'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'product_variants',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          product_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'products',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
          },
          sku: {
            type: Sequelize.STRING(100),
            unique: true,
          },
          attributes: {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
          price_adjustment: {
            type: Sequelize.DECIMAL(10, 2),
            defaultValue: 0,
          },
          stock_quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
          },
          image_url: Sequelize.STRING(500),
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

      // Add indexes
      await queryInterface.addIndex('product_variants', ['product_id'], {
        transaction,
      });
      await queryInterface.addIndex('product_variants', ['sku'], {
        unique: true,
        transaction,
      });
      await queryInterface.addIndex('product_variants', ['is_active'], {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_variants');
  },
};
