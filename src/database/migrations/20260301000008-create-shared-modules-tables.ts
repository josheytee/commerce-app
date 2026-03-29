'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Create media table
        await queryInterface.createTable('media', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            key: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            thumbnail_url: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            medium_url: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            alt_text: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            title: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            caption: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            type: {
                type: Sequelize.ENUM(
                    'vendor_logo',
                    'vendor_cover',
                    'vendor_gallery',
                    'product_image',
                    'product_gallery',
                    'user_avatar',
                    'user_cover',
                    'section_image',
                    'category_image',
                    'review_image',
                ),
                allowNull: false,
            },
            entity_type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            entity_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            sort_order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            is_primary: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            metadata: {
                type: Sequelize.JSONB,
                allowNull: true,
            },
            file_size: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            mime_type: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            uploaded_by: {
                type: Sequelize.INTEGER,
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

        // Create ratings table
        await queryInterface.createTable('ratings', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            comment: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            entity_type: {
                type: Sequelize.STRING(100),
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
            criteria_scores: {
                type: Sequelize.JSONB,
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
        await queryInterface.addIndex('media', ['entity_type', 'entity_id'], {
            name: 'media_entity_index',
        });

        await queryInterface.addIndex('ratings', ['entity_type', 'entity_id'], {
            name: 'ratings_entity_index',
        });

        await queryInterface.addIndex(
            'ratings',
            ['entity_type', 'entity_id', 'user_id'],
            {
                name: 'ratings_user_entity_unique',
                unique: true,
            },
        );

        // Add foreign key constraints
        await queryInterface.addConstraint('media', {
            fields: ['uploaded_by'],
            type: 'foreign key',
            name: 'fk_media_uploaded_by',
            references: {
                table: 'users',
                field: 'id',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        });

        await queryInterface.addConstraint('ratings', {
            fields: ['user_id'],
            type: 'foreign key',
            name: 'fk_ratings_user_id',
            references: {
                table: 'users',
                field: 'id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Drop tables (order matters due to foreign keys)
        await queryInterface.dropTable('ratings');
        await queryInterface.dropTable('reviews');
        await queryInterface.dropTable('media');

        // Drop ENUM types
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_media_type";',
        );
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_reviews_type";',
        );
    },
};
