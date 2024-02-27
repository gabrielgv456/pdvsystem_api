//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function findTransactionsProducts(request, response) {

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
        return response.json({ Success: true, findTransactionsProducts })
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }
}