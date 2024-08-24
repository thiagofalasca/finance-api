import Transaction from '../models/Transaction.js';
import { Op } from 'sequelize';
import { NotFoundError } from '../utils/errors.js';
import { findUserById } from './userService.js';
import { findCategoryByName, findAllCategoriesByName } from './categoryService.js';

// Função para buscar transação pelo ID
const findTransactionById = async (id, user_id, is_admin = false) => {
    const whereCondition = is_admin ? { id } : { id, user_id };
    const transaction = await Transaction.findOne({ where: whereCondition });
    // Lança erro se a categoria não for encontrado
    if (!transaction) throw new NotFoundError('Transação não encontrada.');
    return transaction;
};

// Função para verificar se a categoria existe
const checkCategory = async (category_name, user_id) => {
    const category = await findCategoryByName(category_name, user_id);
    // Lança erro se a categoria não for encontrada
    if (!category) throw new NotFoundError('Categoria não encontrada.');
    return category;
};

// Função para listar transações com paginação e filtros
const listTransactions = async (req, is_admin = false) => {
    const loggedUserId = req.userId;
    const { page = 1, limit = 5, id, type, date, description, category_name, user_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    // Construção dinâmica do filtro de busca
    const where = {};
    if (id) where.id = id;
    if (type) where.type = { [Op.like]: `%${type}%` };
    if (date)
        where.date = {
            [Op.between]: [
                new Date(date).setHours(0, 0, 0, 0),
                new Date(date).setHours(23, 59, 59, 999),
            ],
        };
    if (description) where.description = { [Op.like]: `%${description}%` };
    // Filtragem por usuário e permissões
    if (!is_admin) {
        where.user_id = loggedUserId;
    } else if (user_id && is_admin) {
        where.user_id = user_id;
    }
    // Filtragem por categoria
    if (category_name) {
        const categories = await findAllCategoriesByName(category_name);
        const categoryIds = categories.map((category) => category.id);
        where.category_id = { [Op.in]: categoryIds };
    }
    const transactions = await Transaction.findAndCountAll({ where, offset, limit: limitNum });
    // Lança erro se nenhuma transação for encontrada
    if (transactions.rows.length === 0) throw new NotFoundError('Nenhuma transação encontrada.');
    // Retorna os dados de paginação e as transações encontradas
    return {
        totalItems: transactions.count,
        totalPages: Math.ceil(transactions.count / limitNum),
        currentPage: pageNum,
        transactions: transactions.rows,
    };
};

// Função para criar uma nova transação
const create = async (req, is_admin = false) => {
    const user_id = is_admin ? req.body.user_id : req.userId;
    const { type, amount, date, description, category_name } = req.body;
    // Verifica se o usuário existe
    const user = await findUserById(user_id);
    // Verifica se a categoria existe
    const category = await checkCategory(category_name, user_id);
    await updateNumTransactions(user, 1)
    // Cria uma nova transação e retorna o objeto criado
    return await Transaction.create({
        type,
        amount,
        date,
        description,
        category_id: category.id,
        user_id,
    });
};

// Função para atualizar uma transação existente
const update = async (req, is_admin = false) => {
    const { type, amount, date, description, category_name } = req.body;
    const user_id = req.userId;
    const transaction_id = req.params.id;
    // Busca a a transação atual
    const transaction = await findTransactionById(transaction_id, user_id, is_admin);
    // Verifica se a categoria existe
    await checkCategory(category_name, transaction.user_id);
    // Cria um objeto para armazenar os dados atualizados
    const updatedData = {};
    if (type && type !== transaction.type) updatedData.type = type;
    if (amount && parseInt(amount) !== parseInt(transaction.amount)) updatedData.amount = amount;
    if (date) updatedData.date = date;
    if (description && description !== transaction.description)
        updatedData.description = description;
    // Se nenhum dado foi alterado, retorna uma mensagem informando
    if (Object.keys(updatedData).length === 0) {
        return { message: 'Nenhum dado alterado.', transaction };
    }
    // Atualiza os dados da transação
    const result = await Transaction.update(updatedData, {
        where: { id: transaction.id },
        returning: true,
    });
    return {
        message: 'Dados atualizados com sucesso!',
        transaction: result[1][0],
    };
};

// Função para deletar uma transação
const deleteTransaction = async (req, is_admin = false) => {
    const transaction_id = req.params.id;
    const user = await findUserById(req.userId);
    // Busca a transação pelo ID
    const transaction = await findTransactionById(transaction_id, req.userId, is_admin);
    // Deleta a transação
    await transaction.destroy();
    await updateNumTransactions(user, -1)
    // Retorna uma mensagem de sucesso
    return { message: 'Transação deletada com sucesso.' };
};

// Função para gerar relatório mensal
const generateReport = async (req) => {
    const userId = req.userId;
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const transactions = await Transaction.findAll({
        where: {
            user_id: userId,
            date: {
                [Op.between]: [startDate, endDate],
            },
        },
    });
    // Calcula as receitas e despesas
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((transaction) => {
        if (transaction.type === 'receita') {
            totalIncome += parseInt(transaction.amount);
        } else if (transaction.type === 'despesa') {
            totalExpense += parseInt(transaction.amount);
        }
    });
    const balance = totalIncome - totalExpense;
    return { message: "Relatório gerado com sucesso!", totalIncome, totalExpense, balance };
};

export { listTransactions, create, update, deleteTransaction, generateReport };
