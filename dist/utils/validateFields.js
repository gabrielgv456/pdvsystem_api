"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateFields;
function validateFields(requiredFields, object, validateEmptyFields = false) {
    if (!object) {
        throw new Error('Objeto obrigatório não informado!');
    }
    requiredFields.map(item => {
        if (!(item in object)) {
            throw new Error('Campo obrigatório não informado: ' + item);
        }
    });
    if (validateEmptyFields) {
        for (const prop in object) {
            if (!object[prop]) {
                throw new Error(`Valor do campo obrigatório ${prop} não foi informado`);
            }
        }
    }
}
