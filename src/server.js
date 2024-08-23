// Importações
import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import errorHandler from './middlewares/errorHandler.js';
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger_doc.json' assert { type: 'json' };
import userController from './controllers/userController.js';
import categoryController from './controllers/categoryController.js';
import transactionController from './controllers/transactionController.js';
import installPath from './controllers/installAPI.js';

// Carregando variáveis de ambiente
dotenv.config();

// Configurando express
const app = express();
app.use(express.json());

// Rotas da aplicação
app.use('/api/', userController);
app.use('/api/', categoryController);
app.use('/api/', transactionController);
app.use('/api/', installPath);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

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
