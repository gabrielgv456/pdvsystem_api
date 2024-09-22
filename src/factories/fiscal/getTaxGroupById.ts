import { Request, Response } from "express";
import prisma from "../../services/prisma";
import { typeGroupByIdRes } from "@shared/api/fiscal/getTaxGroups";
import { defaultErrorType } from "@shared/error";

export const getTaxGroupById = async (request: Request, response: Response) => {
    try {
        const req = request.query;
        if (!req.idUser) throw new Error('Id usuário não informado!')
        if (!req.id) throw new Error("Id do Grupo de tributação não informado!")
        const taxGroup = await prisma.taxGroup.findUnique({
            where: { storeId_id: { storeId: Number(req.idUser), id: Number(req.id) } },
            select: {
                description: true,
                id: true,
                individual: true,
                taxCofins: true,
                taxCofinsId: true,
                taxIcms: { include: { taxIcmsNfce: true, taxIcmsNfe: true, taxIcmsNoPayer: true, taxIcmsSt: true, taxIcmsOrigin: true } },
                taxIcmsId: true,
                taxIpi: true,
                taxIpiId: true,
                taxPis: true,
                taxPisId: true,
                code: true
            }
        })
        if (!taxGroup) throw new Error('Grupo de tributação não encontrado')
        const result: typeGroupByIdRes = { Success: true, taxGroup }
        return response.status(200).json(result)
    } catch (error) {
        const result: defaultErrorType = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}