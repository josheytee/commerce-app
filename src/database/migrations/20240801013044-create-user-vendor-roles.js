module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_vendor_roles', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'vendors',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
    });

    await queryInterface.addConstraint('user_vendor_roles', {
      fields: ['user_id', 'vendor_id'],
      type: 'unique',
      name: 'unique_user_vendor'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_vendor_roles');
  },
};
