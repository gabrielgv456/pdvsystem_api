import { sharedProductsError, sharedProdutcsSuccess, sharedProdutcsType } from '@shared/api/inventoryManagement/productsResponse'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function products(request: Request, response: Response) {

    try {
        const { userId } = request.query
        if (!userId) { throw new Error('Informe o userId') }
        const listProducts: sharedProdutcsType[] = await prisma.products.findMany({
            include: {
                taxGroup: {
                    include: {
                        taxIcms: { include: { taxIcmsNfce: true, taxIcmsNfe: true, taxIcmsNoPayer: true, taxIcmsOrigin: true, taxIcmsSt: true } },
                        taxCofins: true,
                        taxIpi: true,
                        taxPis: true
                    }
                },
                deliveries: { include: { itemSell: true }, where: { status: 'Pending' } },
                image: true
            },
            orderBy: { id: 'desc' },
            where: { storeId: Number(userId) }
        })
        if (!listProducts) {
            throw new Error('Falha ao encontrar produtos!')
        }
        else {

            for (const product of listProducts) {

                product.totalValue = product.quantity * product.value

                if (product.image) {

                    product.urlImage = ((product.image.host ?? '') + (product.image.path ?? '') + (product.image?.nameFile ?? '')) ?? null
                }
            }

            const result: sharedProdutcsSuccess = {
                Success: true,
                listProducts
            }

            return response.json(result)
        }
    }

    catch (error) {
        const result: sharedProductsError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}
