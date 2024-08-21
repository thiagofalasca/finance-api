import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

// Define o modelo 'Category' com Sequelize
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

// Define o relacionamento entre Category e User
Category.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Category, { foreignKey: 'user_id' });

export default Category;
