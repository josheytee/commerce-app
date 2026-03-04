'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_vendor_role_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_vendor_role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user_vendor_roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add indexes for better performance
    await queryInterface.addIndex(
      'user_vendor_role_permissions',
      ['user_vendor_role_id'],
      {
        name: 'idx_user_vendor_role_permissions_role_id',
      },
    );

    await queryInterface.addIndex(
      'user_vendor_role_permissions',
      ['permission_id'],
      {
        name: 'idx_user_vendor_role_permissions_permission_id',
      },
    );

    // Add composite unique constraint to prevent duplicate permissions
    await queryInterface.addIndex(
      'user_vendor_role_permissions',
      ['user_vendor_role_id', 'permission_id'],
      {
        name: 'idx_user_vendor_role_permissions_unique',
        unique: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first (optional but cleaner)
    await queryInterface.removeIndex(
      'user_vendor_role_permissions',
      'idx_user_vendor_role_permissions_role_id',
    );
    await queryInterface.removeIndex(
      'user_vendor_role_permissions',
      'idx_user_vendor_role_permissions_permission_id',
    );
    await queryInterface.removeIndex(
      'user_vendor_role_permissions',
      'idx_user_vendor_role_permissions_unique',
    );

    // Drop the table
    await queryInterface.dropTable('user_vendor_role_permissions');
  },
};
