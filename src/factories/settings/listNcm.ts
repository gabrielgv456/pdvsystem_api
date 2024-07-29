import { Request, Response } from 'express'
import { readFileSync } from 'fs';
import { join } from 'path';

const filePath = join(__dirname, '../../utils/NCM.json');
const nomenclaturas = JSON.parse(readFileSync(filePath, 'utf-8'));

export default async function listNcm(request: Request, response: Response) {
    try {
        //https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json  ATUALIZAR NCM JSON

        //const validNCM = ncm.Nomenclaturas.filter(item => { item.Data_Inicio < new Date() })
        const ncmList = nomenclaturas
        
        for (const item of ncmList) {
            delete item.Data_Fim
            delete item.Data_Inicio
            delete item.Ano_Ato
            delete item.Numero_Ato
            delete item.Tipo_Ato
        }
        return response.json({ Success: true, ncmList })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}
