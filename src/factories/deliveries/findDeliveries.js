const prisma = require('../../services/prisma')
const validateFields = require('../../utils/validateFields');

module.exports = async function findDeliveries(request, response) {
    try {
        const dataFindDeliveries = request.query
        console.log(dataFindDeliveries)
        requiredFields = ['storeId', 'initialDate', 'finalDate']
        validateFields(requiredFields, dataFindDeliveries)
        const resultDeliveries = await prisma.deliveries.findMany({
            include: {
                address: true,
                client: true,
                itemSell: { include: { sell: true } }
            },
            orderBy: { id: 'asc' },
            where: {
                AND: [{
                    created_at: {
                        gt: new Date(dataFindDeliveries.initialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${dataFindDeliveries.finalDate}T23:59:59Z`)
                    }
                },
                { storeId: parseInt(dataFindDeliveries.storeId) }
                ]
            }
        })
        return response.json({ Success: true, resultDeliveries })
    }
    catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }
}