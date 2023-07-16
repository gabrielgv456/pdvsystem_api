const prisma = require('../../services/prisma')

module.exports = async function findTransactionsProducts(request, response) {

    const { dataFindTransactionsProduct } = request.body
    
    try {
        const findTransactionsProducts = await prisma.transactionsProducts.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND:
                    [
                        { productId: dataFindTransactionsProduct.id },
                        { storeId: dataFindTransactionsProduct.storeId }
                    ]
            }
        })
        return response.json({ Sucess: true, findTransactionsProducts })
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }
}