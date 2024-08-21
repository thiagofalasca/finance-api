import { AppError } from '../utils/errors.js';

const errorHandler = (err, req, res, next) => {
    // Verifica se o erro é uma instância de AppError (erros esperados e tratados)
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    // Loga o erro no console para facilitar a depuração
    console.error(err);
    // Retorna uma resposta genérica para erros inesperados
    return res.status(500).json({ error: 'Erro interno do servidor' });
};

export default errorHandler;
