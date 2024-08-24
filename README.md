# Finance API

## Descrição

Finance API é uma API back-end desenvolvida em Node.js usando Express, que visa gerenciar as operações financeiras do usuário. A API permite que os usuários cadastrem, atualizem, excluam e visualizem suas transações, categorizando-as em receitas e despesas, além de gerar relatórios.

## Funcionalidades

- Sistema de autenticação com JWT (JSON Web Token)
- CRUD de usuários, transações e categorias
- Filtros e paginação nas listagens
- Geração de relatórios financeiros
- Documentação automática com Swagger

## Tecnologias Utilizadas

- **Node.js**: Plataforma para execução do código JavaScript no backend.
- **Express**: Framework para construção de APIs em Node.js.
- **Sequelize**: ORM para mapeamento objeto-relacional.
- **PostgreSQL**: Banco de dados relacional.
- **JWT**: Autenticação baseada em tokens.
- **ESLint & Prettier**: Ferramentas para linting e formatação de código.
- **Swagger**: Documentação da API.
- **bcryptjs**: Biblioteca para hash de senhas.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **express-validator**: Validação de dados em Express.

## Pré-requisitos

Antes de começar, certifique-se de ter o Node.js e o PostgreSQL instalados em sua máquina.

- **Node.js**: v14+ (https://nodejs.org/)
- **PostgreSQL**: v12+ (https://www.postgresql.org/)

## Instalação

1. **Clone o repositório:**

   ```
   git clone https://github.com/thiagofalasca/finance-api.git
   cd finance-api
   ```

2. **Instale as dependências:**

    ```
    npm install
    ```

3. **Configure as variáveis deambiente:**

    Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

    ```
    DB_DIALECT=postgres
    DB_HOST=localhost
    DB_NAME=finance_api
    DB_USER=seu-usuário
    DB_PASS=sua-senha
    DB_PORT=5432
    JWT_SECRET=sua-chave-secreta
    PORT=3000
    ```

4. **Configure o banco de dados:**

    Certifique-se de que o PostgreSQL esteja rodando e crie o banco de dados:

    ```
    CREATE DATABASE my_finance;
    ```

5. **Inicie o servidor:**

    ```
    npm run dev
    ```

    O servidor estará disponível em http://localhost:3000.

## Uso

## Documentação

A documentação completa da API pode ser acessada via Swagger em:

    ```
    GET /api/docs
    ```

## Testes

Testes das funcionalidades podem ser realizados utilizando o Thunder Client ou Postman.
