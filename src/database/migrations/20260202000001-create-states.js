'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('states', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      country_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'countries',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'State code (e.g., CA, Lagos, TX)',
      },
      capital: {
        type: Sequelize.STRING(255),
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
    await queryInterface.addIndex('states', ['country_id']);
    await queryInterface.addIndex('states', ['name']);
    await queryInterface.addIndex('states', ['code']);
    await queryInterface.addIndex('states', ['is_active']);

    // Composite index for faster lookups
    await queryInterface.addIndex('states', ['country_id', 'name'], {
      name: 'idx_states_country_name',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('states');
  },
};
