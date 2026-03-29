'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
        type: Sequelize.ENUM('vendor', 'product', 'store', 'service'),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      pros: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      cons: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      images: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      helpful_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      not_helpful_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      is_verified_purchase: {
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

    await queryInterface.addIndex('reviews', ['entity_type', 'entity_id'], {
      name: 'reviews_entity_index',
    });

    await queryInterface.addConstraint('reviews', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_reviews_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('reviews');
  },
};
