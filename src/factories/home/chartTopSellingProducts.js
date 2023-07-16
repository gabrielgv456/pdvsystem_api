const prisma = require('../../services/prisma')

module.exports = async function chartTopSellingProducts(request, response) {

    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)


        const topSellingProducts = await prisma.itensSell.groupBy({
            where: {
                AND: [{
                    created_at: {
                        gt: initialDate
                    }
                },
                {
                    created_at: {
                        lt: finalDate
                    }
                },
                { storeId: userId },
                ]
            },
            _sum: { quantity: true },
            by: ['idProduct'],
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        })

        await Promise.all(
            topSellingProducts.map(async sell => {
                sell.quantity = sell._sum.quantity
                const findProducts = await prisma.products.findUnique({
                    where: { id: sell.idProduct }
                })
                sell.productName = findProducts.name
                delete sell._sum
            }
            )
        )
        return response.json({ Success: true, topSellingProducts })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}