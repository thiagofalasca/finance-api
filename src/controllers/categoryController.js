import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { create, deleteCategory, listCategories, update } from '../services/categoryService.js';
import { idValidationRules, nameValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listCategoriesValidationRules, updateCategoryValidationRules } from '../middlewares/validators/categoryValidators.js';

const router = express.Router();

// Rotas para usuários comuns:
router.get('/categories',
    /*
    #swagger.path = '/api/categories/'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Retorna uma lista com paginação de todas as categorias do usuário autenticado, podendo filtrar por ID e nome.'
    #swagger.parameters['page'] = {
        in: 'query',                            
        description: 'Pagina da lista.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['limit'] = {
        in: 'query',                            
        description: 'Limite da lista.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['id'] = {
        in: 'query',                            
        description: 'Id da categoria.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['name'] = {
        in: 'query',                            
        description: 'Nome da categoria.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Categoria(s) encontrada(s).' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    listCategoriesValidationRules(),
    validateData,
    requestHandler(200, listCategories)
);

router.post('/categories',
    /*
    #swagger.path = '/api/categories/'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Cria uma nova categoria para o usuário autenticado.'
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome da categoria.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Categoria criada.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[409] = { description: 'Nome já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    nameValidationRules(),
    validateData,
    requestHandler(201, create),
);

router.put('/categories/:id',
    /*
    #swagger.path = '/api/categories/{id}'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Atualiza o nome de uma categoria específica do usuário autenticado.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da categoria.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome da categoria.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[409] = { description: 'Nome já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    updateCategoryValidationRules(),
    validateData,
    requestHandler(200, update),
);

router.delete('/categories/:id',
    /*
    #swagger.path = '/api/categories/{id}'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Deleta uma categoria específica do usuário autenticado.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da categoria.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.responses[200] = { description: 'Categoria deletada com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    idValidationRules('param'),
    validateData,
    requestHandler(200, deleteCategory),
);

// Rotas para administradores:
router.get('/admins/categories',
    /*
    #swagger.path = '/api/admins/categories'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Retorna uma lista com paginação de todas as categorias de todos os usuários, podendo filtrar por ID e nome.'
    #swagger.parameters['page'] = {
        in: 'query',                            
        description: 'Pagina da lista.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['limit'] = {
        in: 'query',                            
        description: 'Limite da lista.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['id'] = {
        in: 'query',                            
        description: 'Id da categoria.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['user_id'] = {
        in: 'query',                            
        description: 'Id do usuário.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['name'] = {
        in: 'query',                            
        description: 'Nome da categoria.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Categoria(s) encontrada(s).' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    listCategoriesValidationRules(),
    idValidationRules('query', true, 'user_id'),
    validateData,
    requestHandler(200, (req) => listCategories(req, true)),
);

router.post('/admins/categories',
    /*
    #swagger.path = '/api/admins/categories/'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Cria uma nova categoria para um usuário específico..'
    #swagger.parameters['user_id'] = {
        in: 'body',                            
        description: 'ID do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome da categoria.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Categoria criada.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[409] = { description: 'Nome já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    nameValidationRules(),
    idValidationRules('body', false, 'user_id'),
    validateData,
    requestHandler(201, (req) => create(req, true)),
);

router.put('/admins/categories/:id',
    /*
    #swagger.path = '/api/admins/categories/{id}'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Atualiza o nome de uma categoria de qualquer usuário.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da categoria.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome da categoria.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[409] = { description: 'Nome já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    updateCategoryValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

router.delete('/admins/categories/:id',
    /*
    #swagger.path = '/api/admins/categories/{id}'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Deleta uma categoria específica do qualquer usuário.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da categoria.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.responses[200] = { description: 'Categoria deletada com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    idValidationRules('param'),
    validateData,
    requestHandler(200, (req) => deleteCategory(req, true)),
);

export default router;
