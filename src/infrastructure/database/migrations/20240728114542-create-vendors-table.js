// migrations/YYYYMMDDHHMMSS-create-vendors-table.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM types first
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_vendors_business_type" AS ENUM ('individual', 'registered_business');`,
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_vendors_document_type" AS ENUM ('id_card', 'passport', 'cac', 'utility_bill');`,
    );
    await queryInterface.sequelize.query(
      `CREATE TYPE "enum_vendors_status" AS ENUM ('pending', 'active', 'suspended', 'inactive');`,
    );

    await queryInterface.createTable('vendors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      business_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      business_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      business_email: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      business_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      business_short_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      business_type: {
        type: Sequelize.ENUM('individual', 'registered_business'),
        allowNull: true,
      },
      document_type: {
        type: Sequelize.ENUM('id_card', 'passport', 'cac', 'utility_bill'),
        allowNull: true,
      },
      document_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'suspended', 'inactive'),
        defaultValue: 'pending',
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reviewed_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rating_average: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0,
      },
      total_ratings: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_reviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      social_media: {
        type: Sequelize.JSONB,
        defaultValue: null,
      },
      delivery_options: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: null,
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      verified_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tax_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      registration_number: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: null,
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
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

    // Add indexes for better performance
    await queryInterface.addIndex('vendors', ['business_name'], {
      name: 'vendors_business_name_idx',
    });
    await queryInterface.addIndex('vendors', ['user_id'], {
      name: 'vendors_user_id_idx',
    });
    await queryInterface.addIndex('vendors', ['category_id'], {
      name: 'vendors_category_id_idx',
    });
    await queryInterface.addIndex('vendors', ['status'], {
      name: 'vendors_status_idx',
    });
    await queryInterface.addIndex('vendors', ['is_verified'], {
      name: 'vendors_is_verified_idx',
    });
    await queryInterface.addIndex('vendors', ['business_email'], {
      name: 'vendors_business_email_idx',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop indexes first (cleanup)
    await queryInterface.removeIndex('vendors', 'vendors_business_name_idx');
    await queryInterface.removeIndex('vendors', 'vendors_user_id_idx');
    await queryInterface.removeIndex('vendors', 'vendors_category_id_idx');
    await queryInterface.removeIndex('vendors', 'vendors_status_idx');
    await queryInterface.removeIndex('vendors', 'vendors_is_verified_idx');
    await queryInterface.removeIndex('vendors', 'vendors_business_email_idx');

    // Drop the table
    await queryInterface.dropTable('vendors');

    // Drop ENUM types (must be after dropping the table)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_vendors_business_type";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_vendors_document_type";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_vendors_status";',
    );
  },
};
