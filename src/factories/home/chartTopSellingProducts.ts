//@ts-check

import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function chartTopSellingProducts(request: Request, response: Response) {

    try {
        const { userId, lastPeriod } = request.query
        if (!lastPeriod || !userId) {
            throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
        }
        const initialDate = new Date()
        initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())))
        const finalDate = new Date()


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
                { storeId: parseInt(userId.toString()) },
                ]
            },
            _sum: { quantity: true },
            by: ['idProduct'],
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        })

        await Promise.all(
            topSellingProducts.map(async sell => { //@ts-ignore
                sell.quantity = sell._sum.quantity
                const findProducts = await prisma.products.findUnique({
                    where: { id: sell.idProduct }
                })
                if (!findProducts) { throw new Error(`Não foi encontrado o produto com id ${sell.idProduct}`) } //@ts-ignore
                sell.productName = findProducts.name //@ts-ignore
                delete sell._sum
            }
            )
        )
        return response.json({ Success: true, content: topSellingProducts })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}