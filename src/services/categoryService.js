import Category from '../models/Category.js';
import { Op } from 'sequelize';
import { ConflictError, NotFoundError } from '../utils/errors.js';
import { findUserById } from './userService.js';

// Função para buscar categoria pelo id
const findCategoryById = async (id, user_id, is_admin = false) => {
    const whereCondition = is_admin ? { id } : { id, user_id };
    const category = await Category.findOne({ where: whereCondition });
    // Lança erro se a categoria não for encontrado
    if (!category) throw new NotFoundError('Categoria não encontrada.');
    return category;
};

// Função para buscar categoria pelo nome e usuário
const findCategoryByName = async (name, user_id) => {
    return await Category.findOne({ where: { name, user_id } });
};

// Função para buscar todas as categorias pelo nome, independente do usuário
const findAllCategoriesByName = async (name) => {
    return await Category.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
};

// Função para verificar se o nome da categoria já está em uso pelo usuário
const checkName = async (name, user_id, category_id = null) => {
    const category = await findCategoryByName(name, user_id);
    // Verifica e lanca erro se o nome estiver em uso por outra categoria
    if (category && category.id !== category_id) {
        throw new ConflictError('Nome já está em uso.');
    }
};

// Função para listar categorias com paginação e filtros
const listCategories = async (req, is_admin = false) => {
    const logged_user_id = req.userId;
    const { page = 1, limit = 5, id, name, user_id } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    // Construção dinâmica do filtro de busca
    const where = {};
    if (id) where.id = id;
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (!is_admin) {
        where.user_id = logged_user_id;
    } else if (user_id && is_admin) {
        where.user_id = user_id;
    }
    // Busca as categorias
    const categories = await Category.findAndCountAll({ where, offset, limit: limitNum });
    // Lança erro se nenhuma categoria for encontrada
    if (categories.rows.length === 0) throw new NotFoundError('Nenhuma categoria encontrada.');
    // Retorna os dados de paginação e as categorias encontradas
    return {
        totalItems: categories.count,
        totalPages: Math.ceil(categories.count / limitNum),
        currentPage: pageNum,
        categories: categories.rows,
    };
};

// Função para criar uma nova categoria
const create = async (req, is_admin = false) => {
    const user_id = is_admin ? req.body.user_id : req.userId;
    const { name } = req.body;
    // Verifica se o usuário existe
    await findUserById(user_id);
    // Verifica se o nome da categoria já está em uso
    await checkName(name, user_id);
    // Cria uma nova categoria e retorna o objeto criado
    return await Category.create({ name, user_id });
};

// Função para atualizar uma categoria existente
const update = async (req, is_admin = false) => {
    const { name } = req.body;
    const category_id = req.params.id;
    // Busca a categoria atual
    const category = await findCategoryById(category_id, req.userId, is_admin);
    // Verifica se o nome já está em uso por outra categoria
    await checkName(name, category.user_id, category.id);
    // Se o nome não foi alterado, retorna uma mensagem informando
    if (name === category.name) {
        return { message: 'Nenhum dado alterado.', category: category };
    }
    // Atualiza o nome da categoria
    const result = await Category.update({ name }, { where: { id: category.id }, returning: true });
    return {
        message: 'Dados atualizados com sucesso!',
        category: result[1][0],
    };
};

// Função para deletar uma categoria
const deleteCategory = async (req, is_admin = false) => {
    const category_id = req.params.id;
    const userId = req.userId;
    // Busca a categoria pelo ID
    const category = await findCategoryById(category_id, userId, is_admin);
    // Deleta a categoria
    await category.destroy();
    // Retorna uma mensagem de sucesso
    return { message: 'Categoria deletada com sucesso.' };
};

export { listCategories, create, update, deleteCategory, findCategoryByName, findAllCategoriesByName };
