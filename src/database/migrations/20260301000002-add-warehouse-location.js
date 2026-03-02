'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Create warehouses table
      await queryInterface.createTable(
        'warehouses',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          store_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'stores',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          address: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          city_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'cities',
              key: 'id',
            },
          },
          contact_person: Sequelize.STRING(255),
          phone: Sequelize.STRING(50),
          is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          deleted_at: Sequelize.DATE,
        },
        { transaction },
      );

      // Add warehouse_id to inventories
      await queryInterface.addColumn(
        'inventories',
        'warehouse_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'warehouses',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        { transaction },
      );

      // Add location_details to inventories
      await queryInterface.addColumn(
        'inventories',
        'location_details',
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction },
      );

      // Add indexes
      await queryInterface.addIndex('warehouses', ['store_id'], {
        transaction,
      });
      await queryInterface.addIndex('warehouses', ['is_active'], {
        transaction,
      });
      await queryInterface.addIndex('inventories', ['warehouse_id'], {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn('inventories', 'location_details', {
        transaction,
      });
      await queryInterface.removeColumn('inventories', 'warehouse_id', {
        transaction,
      });
      await queryInterface.dropTable('warehouses', { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
