import { listValidationRules, idValidationRules, nameValidationRules } from './genericValidators.js';

// Regras de validação para listagem de categorias
const listCategoriesValidationRules = () => {
    return [
        listValidationRules(),
        idValidationRules('query', true),
        nameValidationRules('query', true),
    ];
};

// Regras de validação para update de categorias
const updateCategoryValidationRules = () => {
    return [idValidationRules('param'), nameValidationRules()];
};

export { listCategoriesValidationRules, updateCategoryValidationRules };
