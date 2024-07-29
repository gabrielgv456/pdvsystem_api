import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'


export default async function changeStatusDeliveries(request:Request, response : Response) {
    try {
        const { dataChangeStatusDeliveries } = request.body
        const requiredFields = ['storeId', 'itensSellToChange', 'newStatus']
        validateFields(requiredFields, dataChangeStatusDeliveries)
        await prisma.deliveries.updateMany({
            where: {
                storeId: dataChangeStatusDeliveries.storeId,
                itemSellId: { in: dataChangeStatusDeliveries.itensSellToChange }
            },
            data: {
                status: dataChangeStatusDeliveries.newStatus,
                deliveredDate: dataChangeStatusDeliveries.deliveredDate ?? null
            }
        })
        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }
}