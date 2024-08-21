// Classe base para erros personalizados
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Erro específico para recursos não encontrados
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

// Erro específico para autenticação não autorizada
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

// Erro específico para conflitos (por exemplo, e-mail já em uso)
class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

// Erro específico para falha de autenticação (como senha incorreta)
class AuthenticationError extends AppError {
    constructor(message = 'Autenticação falhou') {
        super(message, 401);
    }
}

// Erro específico para acesso negado
class ForbiddenError extends AppError {
    constructor(message = 'Acesso negado') {
        super(message, 403);
    }
}

export {
    AppError,
    NotFoundError,
    UnauthorizedError,
    ConflictError,
    AuthenticationError,
    ForbiddenError,
};
