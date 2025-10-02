import axios from 'axios'

export function createSequence(number: number) {
    return Array.from({ length: number }, (_, index) => index);
}

export function generateNumberRandom() {
    var stringAleatoria = '';
    var caracteres = '0123456789';
    for (var i = 0; i < 6; i++) {
        stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return stringAleatoria;
}

export function onlyNumbers(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    return Number(onlyNumbers);
}

export function onlyNumbersStr(value: string) {
    const onlyNumbers = value.replace(/\D/g, '');
    return onlyNumbers
}

export async function getFileUrlAsBase64(url:string) {
    
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer' 
      });
  
      const base64String = Buffer.from(response.data, 'binary').toString('base64');
  
      return base64String;
    } catch (error) {
      console.error('Erro ao buscar ou converter o arquivo:', error);
    }
  }