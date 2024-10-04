# Finance API

## Description

Finance API is a back-end API developed in Node.js using Express, which aims to manage the user's financial operations. The API allows users to register, update, delete and view their transactions, categorizing them into income and expenses, in addition to generating reports.

## Features

- Authentication system with JWT (JSON Web Token)
- CRUD of users, transactions and categories
- Filters and pagination in listings
- Generation of financial reports
- Automatic documentation with Swagger

## Technologies Used

- **Node.js**: Platform for executing JavaScript code in the backend.
- **Express**: Framework for building APIs in Node.js.
- **Sequelize**: ORM for object-relational mapping.
- **PostgreSQL**: Relational database.
- **JWT**: Token-based authentication.
- **ESLint & Prettier**: Linting and code formatting tools.
- **Swagger**: API documentation.
- **bcryptjs**: Password hashing library.
- **dotenv**: Environment variable management.
- **express-validator**: Data validation in Express.

## Prerequisites

Before you start, make sure you have Node.js and PostgreSQL installed on your machine.

- **Node.js**: v14+ (https://nodejs.org/)
- **PostgreSQL**: v12+ (https://www.postgresql.org/)

## Installation

1. **Clone the repository:**

```
git clone https://github.com/thiagofalasca/finance-api.git
cd finance-api
```

2. **Install the dependencies:**

```
npm install
```

3. **Set the environment variables:**

Create a .env file in the project root with the following variables:

```
DB_DIALECT=postgres
DB_HOST=localhost
DB_NAME=finance_api
DB_USER=your-username
DB_PASS=your-password
DB_PORT=5432
JWT_SECRET=your-secret-key
PORT=3000
```

4. **Set up the database:**

Make sure PostgreSQL is running and create the database:

```
CREATE DATABASE my_finance;
```

5. **Start the server:**

```
npm run dev
```

The server will be available at http://localhost:3000.

## Usage

## Documentation

The full API documentation can be accessed via Swagger at:

```
GET /api/docs
```

## Testing

Functionality tests can be performed using Thunder Client or Postman.
