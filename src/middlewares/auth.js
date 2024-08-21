import jwt from 'jsonwebtoken';
import { AuthenticationError, ForbiddenError } from '../utils/errors.js';

const verifyToken = (req, res, next) => {
    // Extrai o token do cabeçalho Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Verifica se o token foi fornecido
    if (!token) throw new AuthenticationError('Token não fornecido, acesso negado.');

    // Verifica e decodifica o token usando a chave secreta do .env
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) throw new ForbiddenError('Token inválido, acesso negado.');
        // Armazena informações do usuário na requisição
        req.userId = decoded.id;
        req.is_admin = decoded.is_admin;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    // Verifica o token e, se válido, prossegue para verificar se é administrador
    verifyToken(req, res, () => {
        // Verifica se o usuário é administrador
        if (!req.is_admin) {
            throw new ForbiddenError('Acesso negado, restrito para administradores.');
        }
        next();
    });
};

export { verifyToken, verifyAdmin };
