//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */


export default async function products(request, response) {

    try {
        const { userId } = request.query
        if (!userId) { throw new Error('Informe o userId') }
        const listProducts = await prisma.products.findMany({
            include: {
                taxIcms: { include: { taxIcmsNfce: true, taxIcmsNfe: true, taxIcmsNoPayer: true, taxIcmsOrigin: true, taxIcmsSt: true } },
                taxCofins: true,
                taxIpi: true,
                taxPis: true,
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
    }

    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}
