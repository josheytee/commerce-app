'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('countries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'ISO country code (e.g., US, NG, GB)',
      },
      phone_code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'International dialing code (e.g., +1, +234)',
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: true,
        comment: 'Currency code (e.g., USD, NGN, GBP)',
      },
      currency_symbol: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // Add indexes
    await queryInterface.addIndex('countries', ['code']);
    await queryInterface.addIndex('countries', ['is_active']);
    await queryInterface.addIndex('countries', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('countries');
  },
};
