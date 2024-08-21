import express from 'express';
import { findUserById, listUsers, register, update, deleteUser, login } from '../services/userService.js';
import { verifyToken, verifyAdmin } from '../middlewares/auth.js';
import {
    userValidationRules,
    loginValidationRules,
    validateData,
    listValidationRules,
    updateUserValidationRules,
    userIdValidationRules,
} from '../middlewares/validators/userValidators.js';

// Função para verificar se é admin
const getUserId = (req, is_admin) => (is_admin ? req.params.id : req.userId);

// Função para manipular respostas
const handleRequest = async (res, next, status, service) => {
    try {
        // Executa a função passada e retorna a resposta
        const result = await service();
        res.status(status).json(result);
    } catch (error) {
        // Passa o erro para o middleware de erros
        next(error);
    }
};

const router = express.Router();

// Rotas dos administradores
// Lista todos os usuários (somente administradores)
router.get('/', verifyAdmin, listValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => listUsers(req.query)),
);
// Registra um novo administrador (somente administradores)
router.post('/admins/register', verifyAdmin, userValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 201, () => register(req.body, true)),
);
// Recupera um usuário por ID (somente administradores)
router.get('/admins/:id', verifyAdmin, userIdValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => findUserById(getUserId(req, true))),
);
// Atualiza um usuário por ID (somente administradores)
router.put('/admins/:id', verifyAdmin, updateUserValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => update(getUserId(req, true), req.body)),
);
// Deleta um usuário por ID (somente administradores)
router.delete('/admins/:id', verifyAdmin, userIdValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => deleteUser(req.params.id)),
);

// Rotas dos usuários
// Registra um novo usuário
router.post('/register', userValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 201, () => register(req.body)),
);
// Recupera informações do usuário autenticado
router.get('/me', verifyToken, (req, res, next) =>
    handleRequest(res, next, 200, () => findUserById(req.userId)),
);
// Atualiza informações do usuário autenticado
router.put('/me', verifyToken, updateUserValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => update(req.userId, req.body)),
);
// Faz o login do usuário e retorna um token JWT
router.post('/login', loginValidationRules(), validateData, (req, res, next) =>
    handleRequest(res, next, 200, () => login(req.body)),
);

export default router;
