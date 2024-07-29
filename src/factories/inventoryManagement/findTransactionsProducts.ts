import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function findTransactionsProducts(request: Request, response: Response) {

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
        return response.status(400).json({ erro: (error as Error).message })
    }
}