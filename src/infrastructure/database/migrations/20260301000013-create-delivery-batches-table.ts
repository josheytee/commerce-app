// migrations/YYYYMMDDHHMMSS-create-tags-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('delivery_batches', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('pending', 'active', 'completed'),
                allowNull: false,
            },

            rider_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'riders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_batches');
    },
};