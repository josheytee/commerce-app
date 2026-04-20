// migrations/012-create-search-documents.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('search_documents', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      entity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      section_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      title: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      search_vector: {
        type: Sequelize.TSVECTOR,
        allowNull: true,
      },
      filters: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      sort_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_synced_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('search_documents', ['entity_type', 'entity_id'], {
      unique: true,
      name: 'search_docs_entity_unique',
    });
    await queryInterface.addIndex('search_documents', ['store_id', 'entity_type', 'is_active'], {
      name: 'search_docs_store_type_active_idx',
    });
    await queryInterface.addIndex('search_documents', ['section_id', 'is_active'], {
      name: 'search_docs_section_active_idx',
    });

    // GIN indexes for JSONB (PostgreSQL)
    await queryInterface.sequelize.query(`
      CREATE INDEX search_docs_filters_idx ON search_documents 
      USING GIN (filters);
    `);
    await queryInterface.sequelize.query(`
      CREATE INDEX search_docs_sort_idx ON search_documents 
      USING GIN (sort_data);
    `);
    await queryInterface.sequelize.query(`
      CREATE INDEX search_docs_fts_idx ON search_documents 
      USING GIN (search_vector);
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('search_documents');
  },
};
