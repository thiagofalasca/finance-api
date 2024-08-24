import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { findUserById, listUsers, register, update, deleteUser, login } from '../services/userService.js';
import { idValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listUserValidationRules, userValidationRules, loginValidationRules, updateUserValidationRules } from '../middlewares/validators/userValidators.js';

const router = express.Router();

// Rotas para administradores
router.get('/users',
    /*
    #swagger.path = '/api/users/'
    #swagger.tags = ['Users']
    #swagger.summary = 'Retorna uma lista com paginação de todos os usuários, podendo filtrar por ID, nome e email.'
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
        description: 'Id do usuário.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['name'] = {
        in: 'query',                            
        description: 'Nome do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['email'] = {
        in: 'query',                            
        description: 'Email do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Usuário encontrado!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhum usuário encontrado.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    listUserValidationRules(),
    validateData,
    requestHandler(200, listUsers),
);

router.post('/admins/users/register',
    /*
    #swagger.path = '/api/admins/users/register'
    #swagger.tags = ['Users']
    #swagger.summary = 'Cria um novo usuário com privilégios de administrador.'
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['email'] = {
        in: 'body',                            
        description: 'Email do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['password'] = {
        in: 'body',                            
        description: 'Senha do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Usuário criado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[409] = { description: 'E-mail já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    userValidationRules(),
    validateData,
    requestHandler(201, (req) => register(req, true)),
);

router.put('/admins/users/:id',
    /*
    #swagger.path = '/api/admins/users/{id}'
    #swagger.tags = ['Users']
    #swagger.summary = 'Atualiza os dados de um usuário qualquer.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID do usuário.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['email'] = {
        in: 'body',                            
        description: 'Email do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['password'] = {
        in: 'body',                            
        description: 'Senha do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[409] = { description: 'E-mail já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    updateUserValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

router.delete('/admins/users/:id',
    /*
    #swagger.path = '/api/admins/users/{id}'
    #swagger.tags = ['Users']
    #swagger.summary = 'Deleta um usuário qualquer.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID do usuário.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.responses[200] = { description: 'Usuário deletada com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    idValidationRules('param'),
    validateData,
    requestHandler(200, (req) => deleteUser(req)),
);

// Rotas para usuários comuns
router.post('/users/register',
    /*
    #swagger.path = '/api/users/register'
    #swagger.tags = ['Users']
    #swagger.summary = 'Cria um novo usuário.'
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['email'] = {
        in: 'body',                            
        description: 'Email do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['password'] = {
        in: 'body',                            
        description: 'Senha do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Usuário criado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma categoria encontrada.' }
    #swagger.responses[409] = { description: 'E-mail já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    userValidationRules(),
    validateData,
    requestHandler(201, register),
);

router.get('/users/me',
    /*
    #swagger.path = '/api/users/me'
    #swagger.tags = ['Users']
    #swagger.summary = 'Retorna uma lista com os dados do usuário autenticado.'
    #swagger.responses[200] = { description: 'Usuário encontrado!' }
    #swagger.responses[404] = { description: 'Usuário não encontrado.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    requestHandler(200, (req) => findUserById(req.userId)),
);

router.put('/users/me',
    /*
    #swagger.path = '/api/users/me'
    #swagger.tags = ['Users']
    #swagger.summary = 'Atualiza os dados do usuário autenticado.'
    #swagger.parameters['name'] = {
        in: 'body',                            
        description: 'Nome do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['email'] = {
        in: 'body',                            
        description: 'Email do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['password'] = {
        in: 'body',                            
        description: 'Senha do usuário.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[409] = { description: 'E-mail já esta em uso.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    updateUserValidationRules(),
    validateData,
    requestHandler(200, update),
);

router.post('/users/login',
    /*
    #swagger.path = '/api/users/login'
    #swagger.tags = ['Users']
    #swagger.summary = 'Autentica um usuário e retorna um token JWT.'
    #swagger.parameters['email'] = {
        in: 'body',                            
        description: 'Email do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['password'] = {
        in: 'body',                            
        description: 'Senha do usuário.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Login realizado com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    loginValidationRules(),
    validateData,
    requestHandler(200, login)
);

export default router;
