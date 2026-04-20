// migrations/001-create-attributes.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_attributes_type" CASCADE;
    `);

    await queryInterface.createTable('attributes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('select', 'multi', 'text', 'boolean', 'number'),
        allowNull: false,
        defaultValue: 'select',
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_filterable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_visible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      is_variant_attribute: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex('attributes', ['code'], {
      name: 'attributes_code_idx',
    });
    await queryInterface.addIndex(
      'attributes',
      ['is_filterable', 'is_variant_attribute'],
      {
        name: 'attributes_flags_idx',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('attributes');
  },
};
