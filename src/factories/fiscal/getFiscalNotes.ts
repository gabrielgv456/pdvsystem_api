import { sharedFiscalNotesSuccess, sharedFiscalNotesError } from "@shared/api/fiscal/getFiscalNotes";
import { Request, Response } from "express";
import prisma from "../../services/prisma";

export const getFiscalNotes = async (request: Request, response: Response) => {
    try {
        const req = request.query;
        if (!req.idUser) throw new Error('Id usuário não informado!')
        const fiscalNotes = await prisma.fiscalNotes.findMany({
            where: { storeId: Number(req.idUser) },
            include: {
                statusNF: true,
                modelNF: true
            }, orderBy :{
                id: "desc"
            }
        })
        const result: sharedFiscalNotesSuccess = { Success: true, fiscalNotes }
        return response.status(200).json(result)
    } catch (error) {
        const result: sharedFiscalNotesError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}