export function createSequence(number) {
    return Array.from({ length: number }, (_, index) => index );
}

export function generateNumberRandom() {
    var stringAleatoria = '';
    var caracteres = '0123456789';
    for (var i = 0; i < 6; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}