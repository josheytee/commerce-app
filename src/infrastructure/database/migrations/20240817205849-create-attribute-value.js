// migrations/002-create-attribute-values.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
          model: 'attributes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      display_value: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      color_code: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      image_url: {
        type: Sequelize.STRING(255),
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

    await queryInterface.addIndex(
      'attribute_values',
      ['attribute_id', 'sort_order'],
      {
        name: 'attr_values_attr_sort_idx',
      },
    );
    await queryInterface.addIndex('attribute_values', ['value'], {
      name: 'attr_values_value_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attribute_values');
  },
};
