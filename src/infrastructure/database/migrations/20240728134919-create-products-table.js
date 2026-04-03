'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      short_description: {
        type: Sequelize.TEXT,
      },
      specification: {
        type: Sequelize.TEXT,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'sections',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      mpn: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      upc: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      ean: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      isbn: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      compare_at_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      meta_title: {
        type: Sequelize.STRING(160),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      meta_keywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      published_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      available_from: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      available_to: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      review_able: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      is_taxable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM(
          'draft',
          'pending',
          'published',
          'archived',
          'out_of_stock',
          'discontinued',
        ),
        defaultValue: 'draft',
        allowNull: false,
      },
      product_type: {
        type: Sequelize.ENUM(
          'simple',
          'variable',
          'digital',
          'service',
          'bundle',
        ),
        defaultValue: 'simple',
        allowNull: false,
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
    // Add unique constraint for store_id + slug
    await queryInterface.addConstraint('products', {
      fields: ['store_id', 'slug'],
      type: 'unique',
      name: 'products_store_slug_unique',
    });

    // Add unique constraint for vendor_id + sku

    // Add indexes
    await queryInterface.addIndex('products', ['store_id']);
    await queryInterface.addIndex('products', ['section_id']);
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['price']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
