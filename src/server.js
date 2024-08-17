// Impotação e configuração do Express
const express = require('express');
const app = express();
app.use(express.json());
require('dotenv').config();

// Rotas da aplicação
app.use('/api/users', require('./routes/userRoutes'));

// Conectando ao banco de dados e iniciando o servidor
const sequelize = require('./config/database');
sequelize
    .sync()
    .then(() => {
        console.log('Banco de dados conectado!');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err);
    });
