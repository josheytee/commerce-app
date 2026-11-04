// src/migrations/XXXXXXXXXXXXXX-create-checkout-sessions.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;

    // ------------------------------------------------------------
    // Explicit enum types (shared, so they live outside the table)
    // ------------------------------------------------------------
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_payment_status" AS ENUM (
          'pending','processing','paid','failed','cancelled',
          'partially_refunded','refunded','expired'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_payment_method" AS ENUM (
          'card','bank_transfer','ussd','mobile_money','wallet'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_payment_provider" AS ENUM (
          'paystack','flutterwave'
        );
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table
    // ------------------------------------------------------------
    await queryInterface.createTable('checkout_sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      // ---- References ----
      idempotency_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      checkout_reference: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'customers', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      cart_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'carts', key: 'id' },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
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
      discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      refunded_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },

      // ---- Payment ----
      payment_status: {
        type: '"enum_payment_status"',
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_provider: {
        type: '"enum_payment_provider"',
        allowNull: true,
      },
      payment_method: {
        type: '"enum_payment_method"',
        allowNull: true,
      },
      payment_reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      payment_metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      failure_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      failure_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // ---- Lifecycle timestamps ----
      paid_at: { type: DataTypes.DATE, allowNull: true },
      failed_at: { type: DataTypes.DATE, allowNull: true },
      cancelled_at: { type: DataTypes.DATE, allowNull: true },
      refunded_at: { type: DataTypes.DATE, allowNull: true },
      expires_at: { type: DataTypes.DATE, allowNull: true },

      // ---- Metadata ----
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
    // Indexes
    // ------------------------------------------------------------
    await queryInterface.addIndex('checkout_sessions', ['customer_id'], {
      name: 'cs_customer_idx',
    });
    await queryInterface.addIndex('checkout_sessions', ['cart_id'], {
      name: 'cs_cart_idx',
    });
    await queryInterface.addIndex('checkout_sessions', ['payment_status'], {
      name: 'cs_payment_status_idx',
    });
    await queryInterface.addIndex(
      'checkout_sessions',
      ['payment_provider', 'payment_reference'],
      { name: 'cs_provider_ref_idx' },
    );
    await queryInterface.addIndex('checkout_sessions', ['created_at'], {
      name: 'cs_created_at_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('checkout_sessions');

    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_payment_status"`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_payment_method"`,
    );
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_payment_provider"`,
    );
  },
};
