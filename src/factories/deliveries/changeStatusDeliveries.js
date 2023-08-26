const prisma = require('../../services/prisma')
const validateFields = require('../../utils/validateFields');

module.exports = async function changeStatusDeliveries(request, response) {
    try {
        const { dataChangeStatusDeliveries } = request.body
        requiredFields = ['storeId', 'itensSellToChange', 'newStatus']
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