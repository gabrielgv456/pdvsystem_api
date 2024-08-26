import axios from 'axios'
import { Request, Response } from 'express';
import validateFields from '../../utils/validateFields';
import { danfeGenReqType } from '../../interfaces/fiscalNoteInterface';



async function loadApi() {
    const generateDanfeApi = axios.create({
        baseURL: process.env.CONVERTERXMLAPI_URL,
        headers: { "Content-Type": "application/json" },
        validateStatus(status) {
            return true
        }
    });

    return generateDanfeApi
}

export const useDanfeGeneratorApi = () => ({

    generateDanfe: async (body: danfeGenReqType) => {

        const generateDanfe = await loadApi()
        const response = await generateDanfe.post('/danfeGenerator', body);
        if (response.data.error) throw new Error(response.data.error)
        if (response.status !== 200) throw new Error('Código de erro: ' + response.status)

        return response.data

    }
})

export const generateDanfe = async (request: Request, response: Response) => {
    try {
        const { generateDanfe } = useDanfeGeneratorApi()
        const reqData: danfeGenReqType = request.body
        validateFields(['profile', 'NFe', 'xml'], reqData)
        const resGenDanfe = await generateDanfe(reqData)
        console.log(resGenDanfe)
        return response.status(200).json({ danfe: resGenDanfe.danfe });
    } catch (error) {
        console.log(error)
        response.status(500).json({ Success: false, erro: (error as Error).message })
    }
}