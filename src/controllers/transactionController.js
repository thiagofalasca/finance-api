import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { create, listTransactions, update, deleteTransaction, generateReport } from '../services/transactionService.js';
import { idValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listTransactionValidationRules, transactionValidationRules, updateTransactionValidationRules, reportValidationRules } from '../middlewares/validators/transactionValidators.js';

const router = express.Router();

// Rotas Para Usuários Comuns:
// Descrição: Retorna uma lista de todas as transações do usuário autenticado, com opções de filtro e paginação.
router.get('/transactions',
    /*
    #swagger.path = '/api/transactions/'
    #swagger.tags = ['Categories']
    #swagger.summary = 'Retorna uma lista com paginação de todas as transações do usuário autenticado, podendo filtrar por ID, type, date, description e category_name.'
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
        description: 'Id da transação.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['type'] = {
        in: 'query',                            
        description: 'Tipo da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['date'] = {
        in: 'query',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'query',                            
        description: 'Descrição da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'query',                            
        description: 'Nome da categoria da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Transação(ões) encontrada(s).' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma transação encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    listTransactionValidationRules(),
    validateData,
    (requestHandler(200, listTransactions)),
);

router.post('/transactions',
    /*
    #swagger.path = '/api/transactions/'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Cria uma nova transação para o usuário autenticado , associada a uma categoria.'
    #swagger.parameters['type'] = {
        in: 'body',                            
        description: 'Tipo da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['amount'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'true',                     
        type: 'Date',      
    }
    #swagger.parameters['date'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'true',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'Descrição da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'body',                            =
        description: 'Nome da categoria da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Transação criada.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    transactionValidationRules(),
    validateData,
    requestHandler(201, create),
);

router.put('/transactions/:id',
    /*
    #swagger.path = '/api/transactions/{id}'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Atualiza os dados de uma transação específica do usuário autenticado.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da transaçao.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.parameters['type'] = {
        in: 'body',                            
        description: 'Tipo da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['amount'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['date'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'Descrição da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'body',                            =
        description: 'Nome da categoria da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Transação não encontrada.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    updateTransactionValidationRules(),
    validateData,
    requestHandler(200, update),
);

router.delete('/transactions/:id',
    /*
    #swagger.path = '/api/transactions/{id}'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Deleta uma transação específica do usuário autenticado.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da transação.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.responses[200] = { description: 'Transação deletada com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Transação não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    idValidationRules(),
    validateData,
    requestHandler(200, deleteTransaction),
);

router.get('/transactions/report',
    /*
    #swagger.path = '/api/transactions/report'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Gera um relatório mensal com total de receitas, despesas e saldo final.'
    #swagger.parameters['month'] = {
        in: 'query',                            
        description: 'Mês do relatório.',                   
        required: 'true',                     
        type: 'number',      
    }
    #swagger.parameters['year'] = {
        in: 'query',                            
        description: 'Ano do relatório.',                   
        required: 'true',                     
        type: 'number',      
    }
    #swagger.responses[200] = { description: 'Relatório gerado com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyToken,
    reportValidationRules(),
    validateData,
    requestHandler(200, generateReport),
);

// Rotas Para Administradores:
router.get('/admins/transactions',
    /*
    #swagger.path = '/api/transactions/'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Retorna uma lista com paginação de todas as transações de todos os usuários, podendo filtrar por ID, type, date, description e category_name.'
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
        description: 'Id da transação.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.parameters['type'] = {
        in: 'query',                            
        description: 'Tipo da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['date'] = {
        in: 'query',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'query',                            
        description: 'Descrição da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'query',                            
        description: 'Nome da categoria da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['user_id'] = {
        in: 'query',                            
        description: 'Id do usuário da transação.',                   
        required: 'false',                     
        type: 'number',      
    }
    #swagger.responses[200] = { description: 'Transação(ões) encontrada(s).' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Nenhuma transação encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    listTransactionValidationRules(),
    validateData,
    requestHandler(200, (req) => listTransactions(req, true)),
);

router.post('/admins/transactions',
    /*
    #swagger.path = '/api/transactions/'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Cria uma nova transação para qualquer usuário , associada a uma categoria.'
    #swagger.parameters['type'] = {
        in: 'body',                            
        description: 'Tipo da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['amount'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'true',                     
        type: 'Date',      
    }
    #swagger.parameters['date'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'true',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'Descrição da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'body',                            =
        description: 'Nome da categoria da transação.',                   
        required: 'true',                     
        type: 'string',      
    }
    #swagger.parameters['user_id'] = {
        in: 'body',                            
        description: 'Id do usuário da transação.',                   
        required: 'true',                     
        type: 'number',      
    }
    #swagger.responses[200] = { description: 'Transação criada.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[404] = { description: 'Usuário não encontrado.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    transactionValidationRules(),
    validateData,
    requestHandler(201, (req) => create(req, true)),
);

router.put('/admins/transactions/:id',
    /*
    #swagger.path = '/api/transactions/{id}'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Atualiza os dados da transação de qualquer usuário.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da transação.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.parameters['type'] = {
        in: 'body',                            
        description: 'Tipo da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['amount'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['date'] = {
        in: 'body',                            
        description: 'Data da transação.',                   
        required: 'false',                     
        type: 'Date',      
    }
    #swagger.parameters['description'] = {
        in: 'body',                            
        description: 'Descrição da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['category_name'] = {
        in: 'body',                            =
        description: 'Nome da categoria da transação.',                   
        required: 'false',                     
        type: 'string',      
    }
    #swagger.parameters['user_id'] = {
        in: 'body',                            
        description: 'Id do usuário da transação.',                   
        required: 'true',                     
        type: 'number',      
    }
    #swagger.responses[200] = { description: 'Dados atualizados com sucesso!' }
    #swagger.responses[200] = { description: 'Nenhum dado alterado.' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Transação não encontrada.' }
    #swagger.responses[404] = { description: 'Categoria não encontrada.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    updateTransactionValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

// Deletar Transação de Qualquer Usuário
// Rota: DELETE /admin/transactions/:id
// Descrição: Deleta uma transação de qualquer usuário.
router.delete('/admins/transactions/:id',
    /*
    #swagger.path = '/api/transactions/{id}'
    #swagger.tags = ['Transactions']
    #swagger.summary = 'Deleta a transação de qualquer usuário.'
    #swagger.parameters['id'] = {
        in: 'param',                            
        description: 'ID da transação.',                   
        required: 'true',                     
        type: 'integer',      
    }
    #swagger.responses[200] = { description: 'Transação deletada com sucesso!' }
    #swagger.responses[400] = { description: 'Dados de entrada inválidos.' }
    #swagger.responses[404] = { description: 'Transação não encontrada.' }
    #swagger.responses[404] = { description: 'Usuário não encontrada.' }
    #swagger.responses[500] = { description: 'Erro no servidor.' }
    */
    verifyAdmin,
    idValidationRules(),
    validateData,
    requestHandler(200, (req) => deleteTransaction(req, true)),
);

export default router;
