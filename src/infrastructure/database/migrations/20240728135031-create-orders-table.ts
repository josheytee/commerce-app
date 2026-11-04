// src/migrations/XXXXXXXXXXXXXX-create-orders.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ------------------------------------------------------------
    // Enum types
    // ------------------------------------------------------------
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_order_status" AS ENUM (
          'pending_payment','paid','confirmed','processing',
          'out_for_delivery','ready_for_pickup','shipped','delivered',
          'completed','cancelled','refunded','partially_refunded',
          'payment_failed'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_fulfillment_mode" AS ENUM (
          'delivery','pickup','digital','appointment'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table
    // ------------------------------------------------------------
    await queryInterface.createTable('orders', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      // ---- References ----
      order_reference: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      checkout_session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'checkout_sessions', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      vendor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'vendors', key: 'id' },
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

      // ---- Status & locking ----
      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: '"enum_order_status"',
        allowNull: false,
        defaultValue: 'pending_payment',
      },

      // ---- Financials ----
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      shipping_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      handling_fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      platform_fee: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Marketplace commission taken at capture',
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      amount_paid: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      amount_refunded: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },

      // ---- Immutable Snapshots (Consolidated) ----
      customer_snapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      store_snapshot: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      // ---- Addresses ----
      shipping_address_snapshot: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      billing_address_snapshot: {
        type: DataTypes.JSONB,
        allowNull: true,
      },

      // ---- Fulfillment ----
      fulfillment_mode: {
        type: '"enum_fulfillment_mode"',
        allowNull: false,
        defaultValue: 'delivery',
      },

      // ---- Timeline ----
      paid_at: { type: DataTypes.DATE, allowNull: true },
      confirmed_at: { type: DataTypes.DATE, allowNull: true },
      shipped_at: { type: DataTypes.DATE, allowNull: true },
      delivered_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
      cancelled_at: { type: DataTypes.DATE, allowNull: true },
      fulfillment_deadline: { type: DataTypes.DATE, allowNull: true },

      // ---- Notes ----
      customer_notes: { type: DataTypes.TEXT, allowNull: true },
      vendor_notes: { type: DataTypes.TEXT, allowNull: true },
      internal_notes: { type: DataTypes.TEXT, allowNull: true },

      // ---- Metadata ----
      metadata: { type: DataTypes.JSONB, allowNull: true },

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
    // Indexes
    // ------------------------------------------------------------
    await queryInterface.addIndex('orders', ['checkout_session_id'], {
      name: 'orders_session_idx',
    });
    await queryInterface.addIndex('orders', ['customer_id'], {
      name: 'orders_customer_idx',
    });
    await queryInterface.addIndex('orders', ['vendor_id', 'status'], {
      name: 'orders_vendor_status_idx',
    });
    await queryInterface.addIndex('orders', ['store_id', 'status'], {
      name: 'orders_store_status_idx',
    });
    await queryInterface.addIndex('orders', ['order_reference'], {
      name: 'orders_reference_idx',
    });
    await queryInterface.addIndex('orders', ['created_at'], {
      name: 'orders_created_at_idx',
    });
  },

  async down(queryInterface) {
    // 1. Remove table first (avoids dependency lockups during clean dropdowns)
    await queryInterface.dropTable('orders');

    // 2. Safely drop matching postgres custom type constraints
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_order_status"`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_fulfillment_mode"`,
    );
  },
};
