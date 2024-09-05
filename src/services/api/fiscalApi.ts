import axios, { AxiosInstance } from 'axios';
import { CreateFiscalNoteInterface } from '../../interfaces/fiscalNoteInterface';
import prisma from '../prisma';
import { onlyNumbers } from '../../utils/utils';

async function loadApi(idUser: number) {
    const user = await prisma.user.findUnique({ where: { id: idUser }, select: { tokenFiscalApi: true } })

    const fiscalApi = axios.create({
        baseURL: process.env.FISCALAPI_URL,
        headers: { Authorization: 'Bearer ' + user.tokenFiscalApi },
        validateStatus(status) {
            return true
        }
    });

    return fiscalApi
}

async function loadTokenApi() {

    const tokenApi = axios.create({
        baseURL: process.env.FISCALAPI_URL,
        validateStatus(status) {
            return true
        }
    });

    return tokenApi
}
async function tokenGenerate(body: { user: string, key: string }, userId: number) {
    const tokenApi = await loadTokenApi();
    const response = await tokenApi.post('/CreateToken', body);
    if (response.data.error) throw new Error(response.data.error)
    if (response.status !== 200) throw new Error('Falha ao gerar token, código de erro: ' + response.status)
    await prisma.user.update({ data: { tokenFiscalApi: response.data.tokenJWT }, where: { id: userId } })
    return response.data
}

export const useFiscalApi = () => ({

    emiteNfe: async (body: CreateFiscalNoteInterface, userId: number, model: 'NFCE' | 'NFE') => {

        const pathApi = (model === 'NFCE') ? '/emitenfce' : '/emitenfe'
        const fiscalApi = await loadApi(userId)
        const response = await fiscalApi.post(pathApi, body);

        if (response.status === 401) {
            const { key, cnpj } = await prisma.user.findUnique({ where: { id: userId } })
            const token = await tokenGenerate({ key, user: String(onlyNumbers(cnpj)) }, userId)
            const result = await fiscalApi.post(pathApi, body, { headers: { Authorization: 'Bearer ' + token.tokenJWT } });
            if (result.data.error) throw new Error(result.data.erro)
            if (result.status !== 200) throw new Error('Código de erro: ' + response.status)
        } else {
            if (response.data.error) throw new Error(response.data.error)
            if (response.status !== 200) throw new Error('Código de erro: ' + response.status)
        }

        return response.data

    },

    uploadCert: async (base64Cert: string, userId: number) => {

        const fiscalApi = await loadApi(userId)
        const response = await fiscalApi.post('/EnviaCertificado', { base64Cert });

        if (response.status === 401) {
            const { key, cnpj } = await prisma.user.findUnique({ where: { id: userId } })
            const token = await tokenGenerate({ key, user: String(onlyNumbers(cnpj)) }, userId)
            const result = await fiscalApi.post('/EnviaCertificado', { base64Cert }, { headers: { Authorization: 'Bearer ' + token.tokenJWT } });
            if (result.data.error) throw new Error(result.data.erro)
            if (result.status !== 200) throw new Error('Código de erro: ' + response.status)
        } else {
            if (response.data.error) throw new Error(response.data.error)
            if (response.status !== 200) throw new Error('Código de erro: ' + response.status)
        }

        return response.data

    },

    EventCancelNote: async (userId: number, body: EventCancelNoteType) => {

        const fiscalApi = await loadApi(userId)
        const response = await fiscalApi.post('/EventoCancelamento', { ...body });

        if (response.status === 401) {
            const { key, cnpj } = await prisma.user.findUnique({ where: { id: userId } })
            const token = await tokenGenerate({ key, user: String(onlyNumbers(cnpj)) }, userId)
            const result = await fiscalApi.post('/EventoCancelamento', { body }, { headers: { Authorization: 'Bearer ' + token.tokenJWT } });
            if (result.data.error) throw new Error(result.data.erro)
            if (result.status !== 200) throw new Error('Código de erro: ' + response.status)
        } else {
            if (response.data.error) throw new Error(response.data.error)
            if (response.status !== 200) throw new Error('Código de erro: ' + response.status)
        }

        return response.data

    },
})


type EventCancelNoteType = {
    chave: string,
    idLote: number,
    CNPJCPF: string,
    protocolo: string,
    justificativa: string,
    ambiente: string,
    cUF: string,
    certificadoSenha: string,
    xml: string
}