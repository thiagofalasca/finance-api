const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');
const User = require('./User');
const Category = require('./Category');

const Transaction = sequelize.define(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
    },
);

Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id',
    onDelete: 'SET NULL',
});

module.exports = Transaction;
