import { body, param, query, validationResult } from 'express-validator';

// Middleware para validar os dados
const validateData = (req, res, next) => {
    const errors = validationResult(req);
    // Retorna erros de validação se tiver
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Regras de validação para listagem
const listValidationRules = () => {
    return [
        // Valida o campo 'page'
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('O campo page deve ser um número inteiro positivo.')
            .trim()
            .escape(),
        // Valida o campo 'limit'
        query('limit')
            .optional()
            .isInt()
            .withMessage('O campo limit deve ser um número inteiro.')
            .bail()
            .isIn([5, 10, 30])
            .withMessage('O campo limit deve ser 5, 10 ou 30.')
            .trim()
            .escape(),
    ];
};

// Regras de validação para campo id
const idValidationRules = (location = 'body', isOptional = false, id = 'id') => {
    const validatorMap = {
        body: body(id),
        param: param(id),
        query: query(id),
    };
    const idValidator = validatorMap[location];
    if (!idValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) idValidator.optional();
    return idValidator
        .isInt({ min: 1 })
        .withMessage(`O campo ${id} deve ser um número inteiro positivo.`)
        .trim()
        .escape();
};

// Regras de validação para campo name
const nameValidationRules = (location = 'body', isOptional = false, maxLength = 255) => {
    const validatorMap = {
        body: body('name'),
        param: param('name'),
        query: query('name'),
    };
    const nameValidator = validatorMap[location];
    if (!nameValidator) throw new Error(`Tipo de validação "${location}" não suportado.`);
    if (isOptional) nameValidator.optional();
    return nameValidator
        .notEmpty()
        .withMessage('O campo name não pode estar vazio.')
        .bail()
        .isLength({ max: maxLength })
        .withMessage(`O campo name deve ter no máximo ${maxLength} caracteres.`)
        .trim()
        .escape();
};

export { validateData, listValidationRules, idValidationRules, nameValidationRules };
