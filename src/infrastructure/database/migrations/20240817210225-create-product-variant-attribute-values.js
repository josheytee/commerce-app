// migrations/009-create-product-variant-attribute-values.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('product_variant_attribute_values', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      variant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'product_variants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      attribute_value_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'attribute_values',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex(
      'product_variant_attribute_values',
      ['variant_id', 'attribute_id'],
      {
        unique: true,
        name: 'var_attr_values_unique',
      },
    );
    await queryInterface.addIndex(
      'product_variant_attribute_values',
      ['attribute_id', 'attribute_value_id'],
      {
        name: 'var_attr_attrval_idx',
      },
    );
    await queryInterface.addIndex(
      'product_variant_attribute_values',
      ['variant_id'],
      {
        name: 'var_attr_variant_idx',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('product_variant_attribute_values');
  },
};
