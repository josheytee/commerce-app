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
        CREATE TYPE "enum_digital_delivery_status" AS ENUM ('pending', 'delivered', 'failed');
      EXCEPTION WHEN duplicate_object THEN null; END $$
    `);

    // ------------------------------------------------------------
    // Table Setup
    // ------------------------------------------------------------
    await queryInterface.createTable('digital_deliveries', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Keeps download URLs flexible for various hosting storage snapshot definitions
      secure_download_url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: '"enum_digital_delivery_status"',
        allowNull: false,
        defaultValue: 'pending',
      },
      download_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_downloads_allowed: {
        type: DataTypes.INTEGER,
        allowNull: true, // null implies unlimited downloads
      },
      expires_at: {
        type: DataTypes.DATE,
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
    await queryInterface.addIndex('digital_deliveries', ['status'], {
      name: 'dig_del_status_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('digital_deliveries');
    await queryInterface.sequelize.query(
      `DROP TYPE IF EXISTS "enum_digital_delivery_status"`,
    );
  },
};
