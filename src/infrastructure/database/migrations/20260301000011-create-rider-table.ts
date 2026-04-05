// migrations/YYYYMMDDHHMMSS-create-tags-table.js
'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('riders', {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            name: Sequelize.STRING,
            phone: Sequelize.STRING,
            status: Sequelize.ENUM('available', 'busy', 'offline'),
            current_lat: Sequelize.DECIMAL(10, 7),
            current_lng: Sequelize.DECIMAL(10, 7),
            created_at: Sequelize.DATE,
            updated_at: Sequelize.DATE,
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('riders');
    },
};