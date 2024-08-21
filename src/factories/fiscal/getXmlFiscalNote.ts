import { Request, Response } from "express";
import prisma from "../../services/prisma"

export const getXmlFiscalNote = async (request: Request, response: Response) => {
    try {
        const { sellId } = request.query
        if (!sellId) { throw new Error('parâmetro sellId não informado!') }

        const fiscalNote = await prisma.fiscalNotes.findMany({
            where: {
                AND: [
                    { sellId: Number(sellId) },
                    { statusNFId: 1 }
                ]
            }
        })

        if (fiscalNote.length === 0) throw new Error('Nenhuma nota fiscal encontrada!')
        if (fiscalNote.length > 1) throw new Error('Foram encontradas mais de uma nota para essa venda!')
        if (!fiscalNote[0].xml) throw new Error('XML não encontrado!')
        if (!fiscalNote[0].keyNF) throw new Error('Chave da nota não encontrada!')

            console.log('aq')

        return response.status(200).json({ Success: true, xml: fiscalNote[0].xml, keyNF: fiscalNote[0].keyNF })
    }
    catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }

}