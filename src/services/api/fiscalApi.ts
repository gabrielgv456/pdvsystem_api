import axios from 'axios';
import { CreateFiscalNoteInterface } from '../../interfaces/fiscalNoteInterface';

const fiscalApi = axios.create({
    baseURL: process.env.FISCALAPI_URL,
    headers: { Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJTbWFydCBORiBBUEkgLSBTb2x1XHUwMEU3XHUwMEUzbyBmaXNjYWwgcGFyYSBlbWlzc1x1MDBFM28gZGUgbm90YXMgZGUgZm9ybWEgXHUwMEUxZ2lsIGUgbW9kZXJuYSIsImlhdCI6MTcyMjQ3MjkwNCwiZXhwIjoxNzIyNTU5MzA0LCJ1c2VyIjoiNDkzOTc3OTIwMDAxNzkiLCJrZXkiOiJONkc1WTc5VFVYMVBXQTEifQ.aOCWDoK8G2s6Eud6oe3kBd9VXVFnBI-PUvNQMmZC4Vw' },
    validateStatus(status) {
        return true
    }

});


export const useFiscalApi = () => ({

    tokenGenerate: async (body: { user: string, key: string }) => {
        const response = await fiscalApi.post('/CreateToken', body);
        if (response.data.error) throw new Error(response.data.error)
        if (response.status !== 200) throw new Error('Falha ao gerar token, código de erro: ' + response.status)
        return response.data
    },

    emiteNfe: async (body: CreateFiscalNoteInterface) => {

        const { tokenGenerate } = useFiscalApi()
        const response = await fiscalApi.post('/emitenfe', body);

        if (response.data.error) throw new Error(response.data.error)

        if (response.status === 401) {
            const token = await tokenGenerate({ key: "N6G5Y79TUX1PWA1", user: "49397792000179" })
            console.log(token)
            const result = await fiscalApi.post('/emitenfe', body, { headers: { Authorization: 'Bearer ' + token.tokenJWT } });
            if (result.data.error) throw new Error(result.data.erro)
            if (result.status !== 200) throw new Error('Código de erro: ' + response.status)
        }

        if (response.status !== 200) throw new Error('Código de erro: ' + response.status)

        return response.data

    }
})