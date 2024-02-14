//@ts-check

import prisma from '../../services/prisma/index.js';
import validateFields from '../../utils/validateFields.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function changeStatusDeliveries(request, response) {
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
        return response.status(400).json({ Success: false, Erro: error.message })
    }
}