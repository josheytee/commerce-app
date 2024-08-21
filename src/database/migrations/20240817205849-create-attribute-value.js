'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('attribute_values', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      attribute_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes', // Assumes that you have an 'attributes' table
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attribute_values');
  }
};
