import axios from 'axios'
import { Request, Response } from 'express';
import validateFields from '../../utils/validateFields';
import { danfeGenReqType } from '../../interfaces/fiscalNoteInterface';



async function loadApi() {
    const generateDanfeApi = axios.create({
        baseURL: process.env.CONVERTERXMLAPI_URL,
        responseType: 'arraybuffer',
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
        console.log(response)
        if (response.data.error) throw new Error(response.data.error)
        if (response.status !== 200) throw new Error('Código de erro: ' + response.status)

        return response

    }
})

export const generateDanfe = async (request: Request, response: Response) => {
    try {
        const { generateDanfe } = useDanfeGeneratorApi()
        const reqData: danfeGenReqType = request.body
        validateFields(['profile', 'NFe', 'xml'], reqData)
        const danfe = await generateDanfe(reqData)

        response.setHeader('Content-Type', 'application/pdf');
        response.setHeader('Content-Disposition', `attachment; filename="${reqData.NFe}.pdf"`);

        return response.send(danfe.data);
    } catch (error) {
        console.log(error)
        response.status(500).json({ Success: false, erro: (error as Error).message })
    }
}