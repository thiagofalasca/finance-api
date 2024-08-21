import { body, param, query, validationResult } from 'express-validator';

// Middleware para validar os dados
const validateData = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Retorna erros de validação
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Regras de validação para listagem de usuários
const listValidationRules = () => {
    return [
        // Valida o campo 'page'
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('O campo page deve ser um número inteiro positivo.'),

        // Valida o campo 'limit'
        query('limit')
            .optional()
            .isInt()
            .withMessage('O campo limit deve ser um número inteiro.')
            .bail()
            .isIn([5, 10, 30])
            .withMessage('O campo limit deve ser 5, 10 ou 30.'),
    ];
};

// Regras de validação para o registro de usuários
const userValidationRules = () => {
    return [
        // Valida o campo 'name'
        body('name').notEmpty().withMessage('O campo name não pode estar vazio.').trim().escape(),

        // Valida o campo 'email'
        body('email')
            .notEmpty()
            .withMessage('O campo email não pode estar vazio.')
            .bail()
            .isEmail()
            .withMessage('O campo email deve ser um endereço de email válido.')
            .normalizeEmail(),

        // Valida o campo 'password'
        body('password')
            .notEmpty()
            .withMessage('O campo password não pode estar vazio.')
            .bail()
            .matches(/^\S*$/)
            .withMessage('O campo password não pode conter espaços em branco.')
            .bail()
            .isLength({ min: 8 })
            .withMessage('O campo password deve ter no mínimo 8 caracteres.')
            .trim()
            .escape(),
    ];
};

// Regras de validação para o registro de usuários
const updateUserValidationRules = () => {
    return [
        // Valida o campo 'id'
        param('id')
            .optional()
            .isInt({ min: 1 })
            .withMessage('O campo id deve ser um número inteiro positivo.'),

        // Valida o campo 'name'
        body('name')
            .optional()
            .notEmpty()
            .withMessage('O campo name não pode estar vazio.')
            .trim()
            .escape(),

        // Valida o campo 'email'
        body('email')
            .optional()
            .notEmpty()
            .withMessage('O campo email não pode estar vazio.')
            .bail()
            .isEmail()
            .withMessage('O campo email deve ser um endereço de email válido.')
            .normalizeEmail(),

        // Valida o campo 'password'
        body('password')
            .optional()
            .notEmpty()
            .withMessage('O campo password não pode estar vazio.')
            .bail()
            .matches(/^\S*$/)
            .withMessage('O campo password não pode conter espaços em branco.')
            .bail()
            .isLength({ min: 8 })
            .withMessage('O campo password deve ter no mínimo 8 caracteres.')
            .trim()
            .escape(),
    ];
};

// Regras de validação para deletar usuários
const userIdValidationRules = () => {
    return [
        // Valida o campo 'id'
        param('id')
            .optional()
            .isInt({ min: 1 })
            .withMessage('O campo id deve ser um número inteiro positivo.'),
    ];
};

// Regras de validação para o login de usuários
const loginValidationRules = () => {
    return [
        // Valida o campo 'email'
        body('email').notEmpty().withMessage('O campo email não pode estar vazio.').trim().escape(),

        // Valida o campo 'password'
        body('password')
            .notEmpty()
            .withMessage('O campo password não pode estar vazio.')
            .trim()
            .escape(),
    ];
};

export {
    validateData,
    listValidationRules,
    userValidationRules,
    updateUserValidationRules,
    userIdValidationRules,
    loginValidationRules,
};
