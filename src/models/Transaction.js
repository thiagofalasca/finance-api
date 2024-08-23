import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';
import User from './User.js';

// Define o modelo 'Transaction' com Sequelize
const Transaction = sequelize.define(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        type: {
            type: DataTypes.STRING,
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

// Define o relacionamento entre Transaction e User
Transaction.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Transaction, { foreignKey: 'user_id' });

// Define o relacionamento entre Transaction e Category
Transaction.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Transaction, { foreignKey: 'category_id' });

export default Transaction;
