'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('store_customers', {
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'stores',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'customers',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add additional indexes for performance
    await queryInterface.addIndex('store_customers', ['store_id']);
    await queryInterface.addIndex('store_customers', ['customer_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('store_customers');
  },
};