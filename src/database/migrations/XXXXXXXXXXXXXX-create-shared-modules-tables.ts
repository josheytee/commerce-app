import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        // Create media table
        await queryInterface.createTable('media', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            url: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            key: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            thumbnail_url: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            medium_url: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            alt_text: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            caption: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM(
                    'vendor_logo',
                    'vendor_cover',
                    'vendor_gallery',
                    'product_image',
                    'product_gallery',
                    'user_avatar',
                    'user_cover',
                    'section_image',
                    'category_image',
                    'review_image'
                ),
                allowNull: false,
            },
            entity_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            entity_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sort_order: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            is_primary: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            file_size: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            mime_type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            uploaded_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
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

        // Create reviews table
        await queryInterface.createTable('reviews', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM('vendor', 'product', 'store', 'service'),
                allowNull: false,
            },
            entity_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            entity_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            pros: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            cons: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            images: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            helpful_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            not_helpful_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            is_verified_purchase: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            is_approved: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            approved_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            approved_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
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

        // Create ratings table
        await queryInterface.createTable('ratings', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            comment: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            entity_type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            entity_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            criteria_scores: {
                type: DataTypes.JSONB,
                allowNull: true,
            },
            metadata: {
                type: DataTypes.JSONB,
                allowNull: true,
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

        // Add indexes
        await queryInterface.addIndex('media', ['entity_type', 'entity_id'], {
            name: 'media_entity_index',
        });

        await queryInterface.addIndex('reviews', ['entity_type', 'entity_id'], {
            name: 'reviews_entity_index',
        });

        await queryInterface.addIndex('ratings', ['entity_type', 'entity_id'], {
            name: 'ratings_entity_index',
        });

        await queryInterface.addIndex('ratings', ['entity_type', 'entity_id', 'user_id'], {
            name: 'ratings_user_entity_unique',
            unique: true,
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('ratings');
        await queryInterface.dropTable('reviews');
        await queryInterface.dropTable('media');

        // Drop ENUM types
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_media_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_reviews_type";');
    },
};