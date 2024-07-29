import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function productsToSell(request: Request, response: Response) {

    try {
        const { userId } = request.query
        if (!userId) { throw new Error('Informe o userId') }

        const listProducts = await prisma.products.findMany({
            include: {
                image: true
            },
            orderBy: { name: 'asc' },
            where: { storeId: Number(userId) }
        })

        if (!listProducts) { throw new Error('Falha ao encontrar produtos!') }

        for (const product of listProducts) {
            //@ts-ignore
            product.totalValue = product.quantity * product.value

            if (product.image) {
                //@ts-ignore
                product.urlImage = ((product.image.host ?? '') + (product.image.path ?? '') + (product.image?.nameFile ?? '')) ?? null
            }
        }

        return response.json({
            Success: true,
            listProducts
        })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}
