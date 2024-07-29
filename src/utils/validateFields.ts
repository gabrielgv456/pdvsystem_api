interface IndexedObject {
    [key: string]: any;
  }
  
  export default function validateFields(requiredFields: string[], object: IndexedObject, validateEmptyFields: boolean | undefined = false): void {
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
  