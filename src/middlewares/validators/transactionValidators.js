import { body, query, param } from 'express-validator';
import { idValidationRules, listValidationRules } from './genericValidators.js';

// Regras de validação para campo type
const typeValidationRules = (location = 'body', isOptional = false) => {
    const validatorMap = {
        body: body('type'),
        param: param('type'),
        query: query('type'),
    };
    const typeValidator = validatorMap[location];
    if (!typeValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) typeValidator.optional();
    return typeValidator
        .isIn(['despesa', 'receita'])
        .withMessage('O campo type deve ser "despesa" ou "receita".');
};

// Regras de validação para campo amount
const amountValidationRules = (location = 'body', isOptional = false, maxLength = 8) => {
    const validatorMap = {
        body: body('amount'),
        param: param('amount'),
        query: query('amount'),
    };
    const amountValidator = validatorMap[location];
    if (!amountValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) amountValidator.optional();

    return amountValidator
        .notEmpty()
        .withMessage('O campo amount não pode estar vazio.')
        .bail()
        .isFloat()
        .withMessage('O campo amount deve ser um número válido.')
        .bail()
        .isLength({ max: maxLength })
        .withMessage(`O campo amount deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape();
};

// Regras de validação para campo date
const dateValidationRules = (location = 'body', isOptional = false) => {
    const validatorMap = {
        body: body('date'),
        param: param('date'),
        query: query('date'),
    };
    const dateValidator = validatorMap[location];
    if (!dateValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) dateValidator.optional();

    return dateValidator
        .notEmpty()
        .withMessage('O campo date não pode estar vazio.')
        .bail()
        .isISO8601()
        .withMessage('O campo date deve estar no formato YYYY-MM-DD.');
};

// Regras de validação para campo description
const descriptionValidationRules = (location = 'body', isOptional = false, maxLength = 255) => {
    const validatorMap = {
        body: body('description'),
        param: param('description'),
        query: query('description'),
    };
    const descriptionValidator = validatorMap[location];
    if (!descriptionValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) descriptionValidator.optional();

    return descriptionValidator
        .isLength({ max: maxLength })
        .withMessage(`O campo description deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape();
};

// Regras de validação para campo category_name
const categoryNameValidationRules = (location = 'body', isOptional = false, maxLength = 255) => {
    const validatorMap = {
        body: body('category_name'),
        param: param('category_name'),
        query: query('category_name'),
    };
    const categoryNameValidator = validatorMap[location];
    if (!categoryNameValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) categoryNameValidator.optional();
    return categoryNameValidator
        .notEmpty()
        .withMessage('O campo category_name não pode estar vazio.')
        .bail()
        .isLength({ max: maxLength })
        .withMessage(`O campo category_name deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape();
};

// Regras de validação o report
const reportValidationRules = () => {
    return [
        // Valida o campo 'month'
        query('month')
            .isInt({ min: 1, max: 12 })
            .withMessage('O campo month deve ser um mês válido entre 1 e 12.')
            .trim()
            .escape(),
        // Valida o campo 'year'
        query('year')
            .isInt({ min: 1900 }) // Ajuste o valor mínimo conforme necessário
            .withMessage('O campo year deve ser um ano válido, a partir de 1900.')
            .trim()
            .escape(),
    ];
};

// Regras de validação para listagem de transações
const listTransactionValidationRules = () => {
    return [
        listValidationRules(),
        idValidationRules('query', true),
        typeValidationRules('query', true),
        amountValidationRules('query', true),
        dateValidationRules('query', true),
        descriptionValidationRules('query', true),
        categoryNameValidationRules('query', true),
    ];
};

// Regras de validação para o registro de uma transação
const transactionValidationRules = () => {
    return [
        typeValidationRules(),
        amountValidationRules(),
        dateValidationRules(),
        descriptionValidationRules(),
        categoryNameValidationRules(),
    ];
};

// Regras de validação para update de transações
const updateTransactionValidationRules = () => {
    return [
        idValidationRules('param'),
        typeValidationRules('body', true),
        amountValidationRules('body', true),
        dateValidationRules('body', true),
        descriptionValidationRules('body', true),
        categoryNameValidationRules('body', true),
    ];
};

export {
    listTransactionValidationRules,
    transactionValidationRules,
    updateTransactionValidationRules,
    reportValidationRules,
};
