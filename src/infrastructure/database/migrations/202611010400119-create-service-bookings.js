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
        CREATE TYPE "enum_booking_status" AS ENUM ('pending', 'confirmed', 'rescheduled', 'completed', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table Setup
    // ------------------------------------------------------------
    await queryInterface.createTable('service_bookings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      status: {
        type: '"enum_booking_status"',
        allowNull: false,
        defaultValue: 'pending',
      },
      scheduled_start_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      scheduled_end_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      provider_notes: {
        type: DataTypes.TEXT,
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

    // ------------------------------------------------------------
    // Index Definitions
    // ------------------------------------------------------------
    await queryInterface.addIndex('service_bookings', ['status'], {
      name: 'sb_status_idx',
    });
    await queryInterface.addIndex(
      'service_bookings',
      ['scheduled_start_at', 'scheduled_end_at'],
      { name: 'sb_schedule_range_idx' },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('service_bookings');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_booking_status"`,
    );
  },
};
