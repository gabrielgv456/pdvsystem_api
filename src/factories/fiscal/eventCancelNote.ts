import { SharedEventCancelNoteRequest, SharedEventCancelNoteResponse } from "@shared/api/fiscal/EventCancelNote";
import { Request, Response } from "express";
import { useFiscalApi } from "../../services/api/fiscalApi";
import prisma from "../../services/prisma";
import validateFields from "../../utils/validateFields";

export const EventCancelNote = async (request: Request, response: Response) => {

    try {
        const req: SharedEventCancelNoteRequest = request.body
        validateFields(['idSell', 'idUser', 'justificativa'], req, true)

        const fiscalNote = await prisma.fiscalNotes.findMany({
            where: {
                AND: [
                    { sellId: req.idSell },
                    { storeId: req.idUser },
                    { statusNFId: 1 } // status 1 = Autorizada
                ]
            }
        })

        if (fiscalNote.length === 0) throw new Error('Não foi encontrado nota fiscal autorizada!')
        if (fiscalNote.length > 1) throw new Error('Foram encontrados mais de uma nota autorizada para mesma venda, entre em contato conosco!')
        if (fiscalNote[0].protocol.length === 0) throw new Error('Protocolo da nota não localizado')

        const user = await prisma.user.findUnique({
            where: { id: req.idUser },
            select: {
                cnpj: true,
                passCert: true,
                addressRelation: {
                    include: { city: { include: { state: true } } }
                }
            }
        })

        const { EventCancelNote } = useFiscalApi()
        const resCancelNote = await EventCancelNote(req.idUser, {
            chave: fiscalNote[0].keyNF,
            CNPJCPF: user.cnpj,
            certificadoSenha: user.passCert,
            justificativa: req.justificativa,
            protocolo: fiscalNote[0].protocol,
            cUF: user.addressRelation.city.state.uf,
            idLote: 1, // o id lote esta definido na funcao que envia nfe, no caso sempre 1 pois envio de uma em uma
            ambiente: String(fiscalNote[0].enviroment)
        })
        console.log(resCancelNote)
        await prisma.fiscalNotes.update({
            data: {
                statusNFId: 2 // cancelado
            }, where: {
                id: fiscalNote[0].id
            }
        })

        const result: SharedEventCancelNoteResponse = { Success: true }
        return response.status(200).json(result)


    } catch (error) {
        const result: SharedEventCancelNoteResponse = { Success: false, Erro: (error as Error).message }
        return response.status(400).json(result)
    }
}

