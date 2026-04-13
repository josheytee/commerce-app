// migrations/YYYYMMDDHHMMSS-create-tags-table.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {

        await queryInterface.createTable('delivery_tracking', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            lng: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            lat: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            fulfillment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'fulfillments',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('delivery_tracking');
    },
};