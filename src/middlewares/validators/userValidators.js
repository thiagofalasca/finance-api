import { body, query, param } from 'express-validator';
import { idValidationRules, listValidationRules, nameValidationRules } from './genericValidators.js';

// Regras de validação para campo email
const emailValidationRules = (
    location = 'body',
    isOptional = false,
    checkValidEmail = true,
    maxLength = 255,
) => {
    const validatorMap = {
        body: body('email'),
        param: param('email'),
        query: query('email'),
    };
    const emailValidator = validatorMap[location];
    if (!emailValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) emailValidator.optional();
    return emailValidator
        .notEmpty()
        .withMessage('O campo email não pode estar vazio.')
        .bail()
        .if(() => checkValidEmail)
        .isEmail()
        .withMessage('O campo email deve ser um endereço de email válido.')
        .bail()
        .isLength({ max: maxLength })
        .withMessage(`O campo email deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape()
        .normalizeEmail();
};

// Regras de validação para campo password
const passwordValidationRules = (
    location = 'body',
    isOptional = false,
    checkValidPassword = true,
    maxLength = 255,
) => {
    const validatorMap = {
        body: body('password'),
        param: param('password'),
        query: query('password'),
    };
    const passwordValidator = validatorMap[location];
    if (!passwordValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) passwordValidator.optional();
    return passwordValidator
        .notEmpty()
        .withMessage('O campo password não pode estar vazio.')
        .bail()
        .if(() => checkValidPassword)
        .matches(/^\S*$/)
        .withMessage('O campo password não pode conter espaços em branco.')
        .bail()
        .isLength({ min: 8 })
        .withMessage('O campo password deve ter no mínimo 8 caracteres.')
        .bail()
        .isLength({ max: maxLength })
        .withMessage(`O campo password deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape();
};

// Regras de validação para listagem de usuários
const listUserValidationRules = () => {
    return [
        listValidationRules(),
        idValidationRules('query', true),
        nameValidationRules('query', true),
        emailValidationRules('query', true, false),
    ];
};

// Regras de validação para o registro de usuários
const userValidationRules = () => {
    return [
        nameValidationRules(),
        emailValidationRules(),
        passwordValidationRules()];
};

// Regras de validação para a atualização de usuários
const updateUserValidationRules = () => {
    return [
        idValidationRules('param', true),
        nameValidationRules('body', true),
        emailValidationRules('body', true),
        passwordValidationRules('body', true),
    ];
};

// Regras de validação para o login de usuários
const loginValidationRules = () => {
    return [
        emailValidationRules(),
        passwordValidationRules('body', false, false)];
};

export { listUserValidationRules, userValidationRules, updateUserValidationRules, loginValidationRules };
