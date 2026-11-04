'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ------------------------------------------------------------
    // Enum Type Registration
    // ------------------------------------------------------------
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_inventory_reservation_status" AS ENUM ('pending', 'released','held', 'completed');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table Setup
    // ------------------------------------------------------------
    await queryInterface.createTable('inventory_reservations', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'inventories', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: '"enum_inventory_reservation_status"',
        allowNull: false,
        defaultValue: 'pending',
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
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

    // ------------------------------------------------------------
    // Index Definitions
    // ------------------------------------------------------------
    await queryInterface.addIndex('inventory_reservations', ['inventory_id'], {
      name: 'inv_res_inventory_idx',
    });
    await queryInterface.addIndex('inventory_reservations', ['status'], {
      name: 'inv_res_status_idx',
    });
    await queryInterface.addIndex('inventory_reservations', ['expires_at'], {
      name: 'inv_res_expires_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventory_reservations');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_inventory_reservation_status"`,
    );
  },
};
