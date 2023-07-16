const prisma = require('../../services/prisma')

module.exports = async function products(request, response) {

    const { userId } = request.body

    if (userId) {
        try {
            const listProducts = await prisma.products.findMany({
                orderBy: { id: 'desc' },
                where: { storeId: userId },
                select: { id: true, name: true, value: true, created_at: true, active: true, quantity: true, barCode: true, cost: true, itemTypeId: true, ncmCode: true, profitMargin: true, unitMeasurement: true, cfopId: true }
            })
            if (listProducts == null) {
                return response.json({
                    erro: "Nenhum produto encontrado para a loja informada"
                })
            }
            else {
                listProducts.map((product) => product.totalValue = product.quantity * product.value)
                return response.json({

                    listProducts

                })
            }
        }

        catch (error) {
            return response.status(400).json({ erro: error.message })
        }
    }
}