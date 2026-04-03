// migrations/YYYYMMDDHHMMSS-create-tags-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create ENUM for tag types
        await queryInterface.sequelize.query(`
      CREATE TYPE "enum_tags_entity_type" AS ENUM ('product', 'vendor', 'store', 'post');
    `);

        await queryInterface.createTable('tags', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            slug: {
                type: Sequelize.STRING(100),
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            usage_count: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            entity_type: {
                type: Sequelize.ENUM('product', 'vendor', 'store', 'post'),
                allowNull: false,
            },
            entity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            vendor_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'vendors',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
            },
        });

        // Add indexes
        await queryInterface.addIndex('tags', ['name'], {
            name: 'tags_name_idx',
            unique: true,
        });
        await queryInterface.addIndex('tags', ['slug'], {
            name: 'tags_slug_idx',
            unique: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('tags');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tags_entity_type";');
    },
};