import { Request, Response } from "express";
import prisma from "../../services/prisma";
import { taxGroupsError, taxGroupsSuccess } from "@shared/api/fiscal/getTaxGroups";
import { getTaxGroupById } from "./getTaxGroupById";

export const getTaxGroups = async (request: Request, response: Response) => {
    try {
        const req = request.query;
        if (!req.idUser) throw new Error('Id usuário não informado!')
        if (req.id) {
            getTaxGroupById(request, response)
        } else {
            const taxGroups = await prisma.taxGroup.findMany({
                where: { AND: [{ storeId: Number(req.idUser), individual: false }] },
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
            const result: taxGroupsSuccess = { Success: true, taxGroups }
            return response.status(200).json(result)
        }
    } catch (error) {
        const result: taxGroupsError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}