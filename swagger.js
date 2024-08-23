import swaggerAutogen from 'swagger-autogen'

const outputFile = './swagger_doc.json';
const endpointsFiles = ['./src/controllers/categoryController.js', './src/controllers/transactionController.js', './src/controllers/userController.js', './src/controllers/installAPI.js'];

const doc = {
    info: {
        version: '1.0',
        title: 'Finance API',
        description: 'API REST para gerenciamento de finaças.'
    },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
