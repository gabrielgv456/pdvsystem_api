"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSequence = createSequence;
exports.generateNumberRandom = generateNumberRandom;
function createSequence(number) {
    return Array.from({ length: number }, (_, index) => index);
}
function generateNumberRandom() {
    var stringAleatoria = '';
    var caracteres = '0123456789';
    for (var i = 0; i < 6; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}
