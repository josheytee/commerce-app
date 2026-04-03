// migrations/YYYYMMDDHHMMSS-create-reviews-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM for review types
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_reviews_entity_type" AS ENUM ('product', 'vendor', 'store', 'service');
    `);

    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.ENUM('product', 'vendor', 'store', 'service'),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rating: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      helpful_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      not_helpful_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
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

    // Add indexes
    await queryInterface.addIndex('reviews', ['entity_type', 'entity_id'], {
      name: 'reviews_entity_index',
    });
    await queryInterface.addIndex('reviews', ['user_id'], {
      name: 'reviews_user_index',
    });
    await queryInterface.addIndex('reviews', ['is_approved'], {
      name: 'reviews_approved_index',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_reviews_entity_type";',
    );
  },
};
