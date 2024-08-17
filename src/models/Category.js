const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
    },
);

Category.hasMany(Transaction, {
    foreignKey: 'category_id',
    onDelete: 'SET NULL',
});

module.exports = Category;
