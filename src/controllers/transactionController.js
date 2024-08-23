import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { create, listTransactions, update, deleteTransaction, generateReport } from '../services/transactionService.js';
import { idValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listTransactionValidationRules, transactionValidationRules, updateTransactionValidationRules, reportValidationRules } from '../middlewares/validators/transactionValidators.js';

const router = express.Router();

// Rotas Para Usuários Comuns:

// Listar Transações
// Rota: GET /transactions
// Descrição: Retorna uma lista de todas as transações do usuário autenticado, com opções de filtro e paginação.
router.get('/transactions',
    verifyToken,
    listTransactionValidationRules(),
    validateData,
    (requestHandler(200, listTransactions)),
);

// Criar Transação
// Rota: POST /transactions
// Descrição: Cria uma nova transação para o usuário autenticado, associada a uma categoria.
router.post('/transactions',
    verifyToken,
    transactionValidationRules(),
    validateData,
    requestHandler(201, create),
);

// Atualizar Transação
// Rota: PUT /transactions/:id
// Descrição: Atualiza os detalhes de uma transação específica do usuário autenticado.
router.put('/transactions/:id',
    verifyToken,
    updateTransactionValidationRules(),
    validateData,
    requestHandler(200, update),
);

// Deletar Transação
// Rota: DELETE /transactions/:id
// Descrição: Deleta uma transação específica do usuário autenticado.
router.delete('/transactions/:id',
    verifyToken,
    idValidationRules(),
    validateData,
    requestHandler(200, deleteTransaction),
);

// Relatório Mensal
// Rota: GET /transactions/report/monthly
// Descrição: Gera um relatório mensal com total de receitas, despesas e saldo final.
router.get('/transactions/report',
    verifyToken,
    reportValidationRules(),
    validateData,
    requestHandler(200, generateReport),
);

// Rotas Para Administradores:

// Listar Transações de Todos os Usuários
// Rota: GET /admin/transactions
// Descrição: Retorna uma lista de todas as transações de todos os usuários. (Pode incluir filtros para transações de usuários específicos.)
router.get('/admins/transactions',
    verifyAdmin,
    listTransactionValidationRules(),
    validateData,
    requestHandler(200, (req) => listTransactions(req, true)),
);

// Criar Transação para Qualquer Usuário
// Rota: POST /admin/transactions
// Descrição: Cria uma nova transação para um usuário específico. (inclui user_id para identificar usuáriuo.)
router.post('/admins/transactions',
    verifyAdmin,
    transactionValidationRules(),
    validateData,
    requestHandler(201, (req) => create(req, true)),
);

// Atualizar Transação de Qualquer Usuário
// Rota: PUT /admin/transactions/:id
// Descrição: Atualiza os detalhes de uma transação de qualquer usuário.
router.put('/admins/transactions/:id',
    verifyAdmin,
    updateTransactionValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

// Deletar Transação de Qualquer Usuário
// Rota: DELETE /admin/transactions/:id
// Descrição: Deleta uma transação de qualquer usuário.
router.delete('/admins/transactions/:id',
    verifyAdmin,
    idValidationRules(),
    validateData,
    requestHandler(200, (req) => deleteTransaction(req, true)),
);

export default router;
