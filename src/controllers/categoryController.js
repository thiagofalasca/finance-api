import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { create, deleteCategory, listCategories, update } from '../services/categoryService.js';
import { idValidationRules, nameValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listCategoriesValidationRules, updateCategoryValidationRules } from '../middlewares/validators/categoryValidators.js';

const router = express.Router();

// Rotas para usuários comuns:

// Listar Categorias
// Rota: GET /categories
// Descrição: Retorna uma lista de todas as categorias do usuário autenticado, podendo filtrar pelo nome.
router.get('/categories',
    verifyToken,
    listCategoriesValidationRules(),
    validateData,
    requestHandler(200, listCategories)
);

// Criar Categoria
// Rota: POST /categories
// Descrição: Cria uma nova categoria para o usuário autenticado.
router.post('/categories',
    verifyToken,
    nameValidationRules(),
    validateData,
    requestHandler(201, create),
);

// Atualizar Categoria
// Rota: PUT /categories/:id
// Descrição: Atualiza o nome de uma categoria específica do usuário autenticado.
router.put('/categories/:id',
    verifyToken,
    updateCategoryValidationRules(),
    validateData,
    requestHandler(200, update),
);

// Deletar Categoria
// Rota: DELETE /categories/:id
// Descrição: Deleta uma categoria específica do usuário autenticado.
router.delete('/categories/:id',
    verifyToken,
    idValidationRules('param'),
    validateData,
    requestHandler(200, deleteCategory),
);

// Rotas para administradores:
// Listar Categorias de Todos os Usuários
// Rota: GET /admins/categories
// Descrição: Retorna uma lista de todas as categorias de todos os usuários. (Pode incluir filtros para categorias de usuários específicos.)
router.get('/admins/categories',
    verifyAdmin,
    listCategoriesValidationRules(),
    idValidationRules('query', true, 'user_id'),
    validateData,
    requestHandler(200, (req) => listCategories(req, true)),
);

// Criar Categoria para Qualquer Usuário
// Rota: POST /admins/categories
// Descrição: Cria uma nova categoria para um usuário específico. (Pode incluir um parâmetro para indicar o usuário.)
router.post('/admins/categories',
    verifyAdmin,
    nameValidationRules(),
    idValidationRules('body', false, 'user_id'),
    validateData,
    requestHandler(201, (req) => create(req, true)),
);

// Atualizar Categoria de Qualquer Usuário
// Rota: PUT /admins/categories/:id
// Descrição: Atualiza os detalhes de uma categoria de qualquer usuário.
router.put('/admins/categories/:id',
    verifyAdmin,
    updateCategoryValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

// Deletar Categoria de Qualquer Usuário
// Rota: DELETE /admins/categories/:id
// Descrição: Deleta uma categoria de qualquer usuário.
router.delete('/admins/categories/:id',
    verifyAdmin,
    idValidationRules('param'),
    validateData,
    requestHandler(200, (req) => deleteCategory(req, true)),
);

export default router;
