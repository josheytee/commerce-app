// src/migrations/XXXXXXXXXXXXXX-create-attributes.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ---- enum for attribute type ----
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_attribute_type" AS ENUM (
          'text','select','color','number','boolean'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ---- attributes ----
    await queryInterface.createTable('attributes', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'vendors', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
      },
      type: {
        type: '"enum_attribute_type"',
        allowNull: false,
        defaultValue: 'select',
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex('attributes', ['slug'], {
      name: 'attributes_slug_idx',
    });
    await queryInterface.addIndex('attributes', ['name'], {
      name: 'attributes_name_idx',
    });

    // ---- attribute_values ----
    await queryInterface.createTable('attribute_values', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'attributes', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      value: { type: DataTypes.STRING(100), allowNull: false },
      display_value: { type: DataTypes.STRING(150), allowNull: false },
      color_code: { type: DataTypes.STRING(20), allowNull: true },
      swatch_image_url: { type: DataTypes.STRING(500), allowNull: true },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });

    await queryInterface.addIndex('attribute_values', ['attribute_id'], {
      name: 'attr_values_attribute_idx',
    });
    await queryInterface.addIndex(
      'attribute_values',
      ['attribute_id', 'value'],
      { name: 'attr_values_attr_value_unique', unique: true },
    );
    await queryInterface.addIndex(
      'attribute_values',
      ['attribute_id', 'sort_order'],
      { name: 'attr_values_sort_idx' },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('attribute_values');
    await queryInterface.dropTable('attributes');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_attribute_type"`,
    );
  },
};
