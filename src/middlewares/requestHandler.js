// Middlweare para manipular respostas
const requestHandler = (status, service) => async (req, res, next) => {
    try {
        // Executa a função passada e retorna a resposta
        const result = await service(req);
        res.status(status).json(result);
    } catch (error) {
        // Passa o erro para o middleware de erros
        next(error);
    }
};

export default requestHandler;
