import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { NotFoundError, UnauthorizedError, ConflictError } from '../utils/errors.js';

// Função para buscar usuário por id
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

// Função para verificar se o email está em uso
const checkEmail = async (email, userId = null) => {
    // Busca o usuário pelo email
    const user = await findUserByEmail(email);
    // Verifica e lanca erro se o email estiver em uso por outro usuário
    if (user && user.id !== userId) {
        throw new ConflictError('E-mail já está em uso.');
    }
};

// Lista os usuários com paginação
const listUsers = async (query) => {
    const { page = 1, limit = 5 } = query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    // Calcula o offset para a paginação
    const offset = (pageNum - 1) * limitNum;
    // Busca os usuários
    const users = await User.findAndCountAll({ offset, limit: limitNum });
    // Lança erro se nenhum usuário for encontrado
    if (users.rows.length === 0) throw new NotFoundError('Nenhum usuário encontrado.');
    return {
        totalItems: users.count,
        totalPages: Math.ceil(users.count / limitNum),
        currentPage: pageNum,
        users: users.rows,
    };
};

// Registra um novo usuário
const register = async (body, is_admin) => {
    const { name, email, password } = body;
    // Verifica se o e-mail já está em uso
    await checkEmail(email);
    // Criptografa a senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    // Cria um novo usuário no banco de dados
    return await User.create({ name, email, password: hashedPassword, is_admin });
};

// Altera os dados de um usuário
const update = async (userId, body) => {
    const { name, email, password } = body;
    // Busca o usuário atual
    const user = await findUserById(userId);
    // Verifica se o email está em uso
    await checkEmail(email, userId);
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

// Deleta um usuário
const deleteUser = async (userId) => {
    // Busca o usuário pelo id
    const user = await findUserById(userId);
    // Deleta o usuário
    await user.destroy();
    // Retorna uma mensagem de sucesso
    return { message: 'Usuário deletado com sucesso.' };
};

// Faz o login do usuário e retorna um token JWT
const login = async (body) => {
    const { email, password } = body;
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

export { findUserById, listUsers, register, update, deleteUser, login };
