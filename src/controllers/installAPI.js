import express from 'express';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database.js';

const router = express.Router();

router.get('/install', async (req, res) => {
    /*
    #swagger.path = '/api/install/'
    #swagger.tags = ['Install']
    #swagger.summary = 'Preenche o banco de dados co informações de teste.'
    #swagger.responses[200] = { description: 'Banco de dados inicializado com sucesso!' }
    #swagger.responses[500] = { description: 'Erro ao inicializar o banco de dados.' }
    */
    try {
        await sequelize.sync({ force: true })
        // Cria um usuário administrador
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@email.com',
            password: await bcrypt.hash('admin123', 10),
            is_admin: true,
        });

        // Cria usuários comuns
        const users = await Promise.all([
            User.create({
                name: 'User 1',
                email: 'user1@email.com',
                password: await bcrypt.hash('user123', 10),
            }),
            User.create({
                name: 'User 2',
                email: 'user2@email.com',
                password: await bcrypt.hash('user123', 10),
            }),
            User.create({
                name: 'User 3',
                email: 'user3@email.com',
                password: await bcrypt.hash('user123', 10),
            }),
            User.create({
                name: 'User 4',
                email: 'user4@email.com',
                password: await bcrypt.hash('user123', 10),
            }),
            User.create({
                name: 'User 5',
                email: 'user5@email.com',
                password: await bcrypt.hash('user123', 10),
            }),
        ]);

        // Cria 3 categorias para cada usuário
        for (const user of [...users, adminUser]) {
            const categories = await Promise.all([
                Category.create({ name: 'Category A', user_id: user.id }),
                Category.create({ name: 'Category B', user_id: user.id }),
                Category.create({ name: 'Category C', user_id: user.id }),
            ]);

            // Cria 3 transações para cada usuário, associadas às suas categorias
            await Promise.all([
                Transaction.create({
                    type: 'income',
                    amount: 100.00,
                    date: new Date(),
                    description: 'Transaction 1',
                    category_id: categories[0].id,
                    user_id: user.id,
                }),
                Transaction.create({
                    type: 'expense',
                    amount: 50.00,
                    date: new Date(),
                    description: 'Transaction 2',
                    category_id: categories[1].id,
                    user_id: user.id,
                }),
                Transaction.create({
                    type: 'income',
                    amount: 75.00,
                    date: new Date(),
                    description: 'Transaction 3',
                    category_id: categories[2].id,
                    user_id: user.id,
                }),
            ]);
        }
        res.status(200).json({ message: 'Banco de dados inicializado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao inicializar o banco de dados.', error: error.message });
    }
});

export default router;
