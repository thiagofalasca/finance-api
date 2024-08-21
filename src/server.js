// Importações
import express from 'express';
import dotenv from 'dotenv';
import userController from './controllers/userController.js';
import errorHandler from './middlewares/errorHandler.js';
import sequelize from './config/database.js';

// Carregando variáveis de ambiente
dotenv.config();

// Configurando express
const app = express();
app.use(express.json());

// Rotas da aplicação
app.use('/api/users', userController);

// Middleware de erro (deve ser o último)
app.use(errorHandler);

// Conectando ao banco de dados e iniciando o servidor
sequelize
    .sync()
    .then(() => {
        console.log('Banco de dados conectado!');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });

export default app;
