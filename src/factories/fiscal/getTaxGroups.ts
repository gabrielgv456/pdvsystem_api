import { Request, Response } from "express";
import prisma from "../../services/prisma";
import { taxGroupsError, taxGroupsSuccess } from "@shared/api/fiscal/getTaxGroups";

export const getTaxGroups = async (request: Request, response: Response) => {
    try {
        const req = request.query;
        if (!req.idUser) throw new Error('Id usuário não informado!')
        const taxGroups = await prisma.taxGroup.findMany({
            where: { AND: [{ storeId: Number(req.idUser), individual: true }] }
        })
        const result: taxGroupsSuccess = { Success: true, taxGroups }
        return response.status(200).json(result)
    } catch (error) {
        const result: taxGroupsError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}