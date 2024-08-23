import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

// Função para criar o usuário administrador e dados de teste
const install = async (req, res, next) => {
    try {
        // Cria o usuário administrador
        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword', // Aqui você pode querer criptografar a senha
            is_admin: true,
        });
        // Cria 5 usuários
        for (let i = 1; i <= 5; i++) {
            await User.create({
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: `password${i}`, // Aqui você pode querer criptografar a senha
                is_admin: false,
            });
        }
        // Cria 5 categorias
        for (let i = 1; i <= 5; i++) {
            await Category.create({
                name: `Category ${i}`,
                user_id: 1, // Associa todas as categorias ao usuário administrador (ou ajuste conforme necessário)
            });
        }
        // Cria 5 transações
        for (let i = 1; i <= 5; i++) {
            await Transaction.create({
                type: i % 2 === 0 ? 'expense' : 'income', // Alterna entre 'expense' e 'income'
                amount: 100 * i,
                date: new Date(),
                description: `Transaction ${i}`,
                category_id: i, // Associa transações às categorias criadas
                user_id: 1, // Associa todas as transações ao usuário administrador (ou ajuste conforme necessário)
            });
        }
        res.status(200).json({ message: 'Dados de teste criados com sucesso!' });
    } catch (error) {
        next(error);
    }
};

export default install;
