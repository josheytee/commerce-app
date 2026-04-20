'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sections', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'sections',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      cover: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      meta_title: {
        type: Sequelize.STRING(160),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex('sections', ['parent_id'], {
      name: 'sections_parent_idx',
    });
    await queryInterface.addIndex('sections', ['slug'], {
      name: 'sections_slug_idx',
    });
    await queryInterface.addIndex('sections', ['is_active', 'sort_order'], {
      name: 'sections_active_sort_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sections');
  },
};