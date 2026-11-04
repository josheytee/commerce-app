'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ------------------------------------------------------------
    // Enum Type Registration (if not created elsewhere)
    // ------------------------------------------------------------
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_fulfillment_type" AS ENUM ('physical', 'digital', 'service');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_order_item_status" AS ENUM ('pending', 'processing', 'fulfilled', 'cancelled', 'refunded');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table Setup
    // ------------------------------------------------------------
    await queryInterface.createTable('order_items', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      // ---- Structural Relations ----
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      variant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'product_variants', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'stores', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      // ---- Immutable Composite Snapshot ----
      product_variant_snapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      // ---- Quantities ----
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      fulfilled_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      refunded_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      cancelled_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // ---- Financial Parameters ----
      unit_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      compare_at_price_snapshot: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
      },
      total_price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },

      // ---- State Modes ----
      fulfillment_type: {
        type: '"enum_fulfillment_type"',
        allowNull: false,
        defaultValue: 'physical',
      },
      status: {
        type: '"enum_order_item_status"',
        allowNull: false,
        defaultValue: 'pending',
      },

      // ---- Polymorphic Feature Links ----
      service_booking_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'service_bookings', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      digital_delivery_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'digital_deliveries', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      inventory_reservation_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'inventory_reservations', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },

      // ---- Extra Properties ----
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      // ---- Timestamps ----
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
    await queryInterface.addIndex('order_items', ['order_id'], {
      name: 'oi_order_idx',
    });
    await queryInterface.addIndex('order_items', ['variant_id'], {
      name: 'oi_variant_idx',
    });
    await queryInterface.addIndex('order_items', ['status'], {
      name: 'oi_status_idx',
    });
  },

  async down(queryInterface) {
    // Drop table first to clean up foreign dependency chains cleanly
    await queryInterface.dropTable('order_items');

    // Clean up corresponding postgres custom types safely
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_fulfillment_type"`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_order_item_status"`,
    );
  },
};
