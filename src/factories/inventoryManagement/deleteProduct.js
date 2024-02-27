// @ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function deleteProduct(request, response) {
    
    const { dataDeleteProduct } = request.body


    try {
        const verifyIfExitsSellsThisProduct = await prisma.itensSell.findFirst({
            where: { idProduct: dataDeleteProduct.id }
        })
        if (verifyIfExitsSellsThisProduct) {
            return response.json({ Success: false, Erro: 'Não é possivel excluir produtos que possuem vendas cadastradas! Realize a desativação clicando em editar.' })
        }

        else {
            const deleteTransationsProducts = await prisma.transactionsProducts.deleteMany({
                where: {
                    AND: [
                        { productId: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            const deleteproduct = await prisma.products.deleteMany({
                where: {
                    AND: [
                        { id: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            if (deleteTransationsProducts && deleteproduct) {
                return response.json({ Success: true })
            }
        }

    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}