import express from 'express';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import requestHandler from '../middlewares/requestHandler.js';
import { findUserById, listUsers, register, update, deleteUser, login } from '../services/userService.js';
import { idValidationRules, validateData } from '../middlewares/validators/genericValidators.js';
import { listUserValidationRules, userValidationRules, loginValidationRules, updateUserValidationRules } from '../middlewares/validators/userValidators.js';

const router = express.Router();

// Rotas para administradores

// Listar Usuários
// Rota: GET /users
// Descrição: Retorna uma lista de todos os usuáris, podendo filtrar por nome, email e id.
router.get('/users',
    verifyAdmin,
    listUserValidationRules(),
    validateData,
    requestHandler(200, listUsers),
);

// Registrar Administrador
// Rota: POST /admins/users/register
// Descrição: Registra um novo usuário
router.post('/admins/users/register',
    verifyAdmin,
    userValidationRules(),
    validateData,
    requestHandler(201, (req) => register(req, true)),
);

// Atualizar Usuário
// Rota: PUT /admins/users/:id
// Descrição: Atualiza os dados de um usuário específico pelo id.
router.put('/admins/users/:id',
    verifyAdmin,
    updateUserValidationRules(),
    validateData,
    requestHandler(200, (req) => update(req, true)),
);

// Deletar Usuário
// Rota: DELETE /admins/users/:id
// Descrição: Deleta um usuário específico pelo id.
router.delete('/admins/users/:id',
    verifyAdmin,
    idValidationRules('param'),
    validateData,
    requestHandler(200, (req) => deleteUser(req)),
);

// Rotas para usuários comuns

// Registrar Usuário
// Rota: POST /users/register
// Descrição: Registra um novo usuário
router.post('/users/register',
    userValidationRules(),
    validateData,
    requestHandler(201, register),
);

// Ver Usuário
// Rota: POST /users/me
// Descrição: Mostra os dados do usuário autenticado
router.get('/users/me',
    verifyToken,
    requestHandler(200, (req) => findUserById(req.userId)),
);

// Atualizar Usuário
// Rota: PUT /users/me
// Descrição: Atualiza os dados do usuário autenticado.
router.put('/users/me',
    verifyToken,
    updateUserValidationRules(),
    validateData,
    requestHandler(200, update),
);

// Login
// Rota: DELETE /users/login
// Descrição: Autentica um usuário e retorna um token JWT
router.post('/users/login',
    loginValidationRules(),
    validateData,
    requestHandler(200, login)
);

export default router;
