import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { NotFoundError, UnauthorizedError, ConflictError } from '../utils/errors.js';

// Função para buscar usuário por ID
const findUserById = async (userId) => {
    const user = await User.findByPk(userId);
    // Lança erro se o usuário não for encontrado
    if (!user) throw new NotFoundError('Usuário não encontrado.');
    return user;
};

// Função para buscar usuário por email
const findUserByEmail = async (email) => {
    return await User.findOne({ where: { email: { [Op.eq]: email } } });
};

// Função para verificar se o e-mail já está em uso
const checkEmail = async (email, userId = null) => {
    const user = await findUserByEmail(email);
    // Verifica e lança erro se o e-mail estiver em uso por outro usuário
    if (user && user.id !== userId) {
        throw new ConflictError('E-mail já está em uso.');
    }
};

// Função para listar usuários com paginação e filtros
const listUsers = async (req) => {
    const { page = 1, limit = 5, id, name, email } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    // Construção dinâmica do filtro de busca
    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (email) where.email = { [Op.like]: `%${email}%` };
    // Busca os usuários com paginação
    const users = await User.findAndCountAll({ where, offset, limit: limitNum });
    // Lança erro se nenhum usuário for encontrado
    if (users.rows.length === 0) throw new NotFoundError('Nenhum usuário encontrado.');
    // Retorna os dados de paginação e os usuários encontrados
    return {
        totalItems: users.count,
        totalPages: Math.ceil(users.count / limitNum),
        currentPage: pageNum,
        users: users.rows,
    };
};

// Função para registrar um novo usuário
const register = async (req, is_admin = false) => {
    const { name, email, password } = req.body;
    // Verifica se o e-mail já está em uso
    await checkEmail(email);
    // Criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    // Cria um novo usuário no banco de dados
    return await User.create({ name, email, password: hashedPassword, is_admin });
};

// Função para atualizar os dados de um usuário
const update = async (req, is_admin = false) => {
    const { name, email, password } = req.body;
    const userId = is_admin ? req.params.id : req.userId;
    // Busca o usuário atual
    const user = await findUserById(userId);
    // Verifica se o e-mail está em uso por outro usuário
    await checkEmail(email, parseInt(userId));
    // Cria um objeto para armazenar os dados atualizados
    const updatedData = {};
    if (name && name !== user.name) updatedData.name = name;
    if (email && email !== user.email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    // Verifica se os dados foram alterados
    if (Object.keys(updatedData).length === 0) {
        return { message: 'Nenhum dado alterado.', user };
    }
    // Atualiza os dados do usuário
    const result = await User.update(updatedData, { where: { id: userId }, returning: true });
    return {
        message: 'Dados atualizados com sucesso!',
        user: result[1][0],
    };
};

// Função para deletar um usuário
const deleteUser = async (req) => {
    const userId = req.params.id;
    // Busca o usuário pelo id
    const user = await findUserById(userId);
    // Deleta o usuário
    await user.destroy();
    // Retorna uma mensagem de sucesso
    return { message: 'Usuário deletado com sucesso.' };
};

// Função para realizar login do usuário e retornar um token JWT
const login = async (req) => {
    const { email, password } = req.body;
    // Recupera o usuário pelo e-mail
    const user = await findUserByEmail(email);
    // Verifica se o usuário existe
    if (!user) throw new NotFoundError('Usuário não encontrado.');
    // Verifica se a senha está correta
    if (await bcrypt.compare(password, user.password)) {
        // Gera um token JWT para o usuário
        const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return { token, user };
    } else throw new UnauthorizedError('Senha incorreta.');
};

// Função para atualizar os dados de um usuário
const updateNumTransactions = async (user, num) => {
    let num_novo = parseInt(user.num_transactions) + num
    // Atualiza o numero de transações do usuário
    await User.update({ num_transactions: num_novo }, { where: { id: user.id } });
    return num_novo
};

export { findUserById, listUsers, register, update, deleteUser, login, updateNumTransactions };
