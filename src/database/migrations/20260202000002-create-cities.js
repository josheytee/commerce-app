'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      state_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'states',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: true,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: true,
      },
      postal_code: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      is_capital: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addIndex('cities', ['state_id']);
    await queryInterface.addIndex('cities', ['name']);
    await queryInterface.addIndex('cities', ['postal_code']);
    await queryInterface.addIndex('cities', ['is_active']);
    await queryInterface.addIndex('cities', ['is_capital']);

    // Composite indexes
    await queryInterface.addIndex('cities', ['state_id', 'name'], {
      name: 'idx_cities_state_name',
    });

    await queryInterface.addIndex('cities', ['state_id', 'postal_code'], {
      name: 'idx_cities_state_postal',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cities');
  },
};
