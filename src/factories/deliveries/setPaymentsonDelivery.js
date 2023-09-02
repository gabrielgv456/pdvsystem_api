const prisma = require('../../services/prisma')
const validateFields = require('../../utils/validateFields');

module.exports = async function changeStatusDeliveries(request, response) {
    try {
        const { dataSetPaymentsonDelivery } = request.body
        requiredFields = ['storeId', 'idDelivery', 'idVenda', 'listMethods', 'codRef']
        validateFields(requiredFields, dataSetPaymentsonDelivery)
        await prisma.$transaction(async (prismaTx) => {
            for (const payment of dataSetPaymentsonDelivery.listMethods) {
                await prismaTx.transactions.create({
                    data: {
                        type: payment.type,
                        description: "Recebimento de venda nº " + dataSetPaymentsonDelivery.codRef + '. Pagamento realizado na entrega',
                        value: payment.value,
                        sellId: dataSetPaymentsonDelivery.idVenda,
                        storeId: dataSetPaymentsonDelivery.storeId,
                        deliveryId: dataSetPaymentsonDelivery.idDelivery
                    }
                })
            }
            await prismaTx.deliveries.updateMany({
                where: {
                    AND: [
                        { sellId: dataSetPaymentsonDelivery.idVenda },
                        { storeId: dataSetPaymentsonDelivery.storeId }
                    ]
                }, data: {
                    onDeliveryPayValue: null
                }
            })
        })
        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }
}