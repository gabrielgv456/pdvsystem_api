//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function deleteSell(request, response) {

    const { dataDeleteSell } = request.body

    try {
        await prisma.$transaction(async (prismaTx) => {

            const deliveriesShipping = await prismaTx.deliveries.findMany({
                where: {
                    status: 'Shipping',
                    sellId: dataDeleteSell.SellId,
                    storeId: dataDeleteSell.UserId
                }
            })

            if (deliveriesShipping.length > 0) throw new Error('Existe(m) entrega(s) dessa venda com status "Em entrega", realize a conclusão antes de realizar o estorno!')

            dataDeleteSell.Products.map(async product => {
                const searchProduct = await prismaTx.products.findUnique({
                    where: {
                        id: product.idProduct
                    }
                })
                if (!searchProduct) { throw new Error(`Não foi encontrado produto com o id ${product.idProduct}`) }
                const updateQntProduct = await prismaTx.products.update({
                    where: {
                        id: searchProduct.id
                    },
                    data: {
                        quantity: searchProduct.quantity + product.quantity
                    }
                })
                await prismaTx.transactionsProducts.create({
                    data: {
                        type: 'E',
                        description: 'Estorno de Venda',
                        quantity: product.quantity,
                        totalQuantity: updateQntProduct.quantity,
                        productId: product.idProduct,
                        storeId: dataDeleteSell.UserId
                    }
                })
            })


            const deleteSellonDB = await prismaTx.sells.updateMany({

                where:
                {
                    AND: [
                        { id: dataDeleteSell.SellId },
                        { storeId: dataDeleteSell.UserId }
                    ]
                },

                data:
                {
                    deleted: true
                }

            })

            await prismaTx.itensSell.updateMany({
                where:
                {
                    AND: [
                        { sellId: dataDeleteSell.SellId },
                        { storeId: dataDeleteSell.UserId }
                    ]
                },
                data:
                {
                    deleted: true
                }
            })

            await prismaTx.deliveries.updateMany({
                where: {
                    AND: [
                        { sellId: dataDeleteSell.SellId },
                        { storeId: dataDeleteSell.UserId },
                        { status: 'Pending' }
                    ]
                }, data: {
                    status: 'Canceled - Pending'
                }
            })

            await prismaTx.deliveries.updateMany({
                where: {
                    AND: [
                        { sellId: dataDeleteSell.SellId },
                        { storeId: dataDeleteSell.UserId },
                        { status: 'Done' }
                    ]
                }, data: {
                    status: 'Canceled - Done'
                }
            })

            if (dataDeleteSell.AddExitTransaction) {
                const deliveriesPendingToPay = await prismaTx.deliveries.findFirst({
                    where: {
                        AND: [
                            { sellId: dataDeleteSell.SellId },
                            { storeId: dataDeleteSell.UserId }
                        ]
                    }, select: { onDeliveryPayValue: true }
                })
                await prismaTx.transactions.create({
                    data: {
                        description: 'Estorno de Venda',
                        type: 'exit',
                        value: dataDeleteSell.SellValue - (deliveriesPendingToPay?.onDeliveryPayValue ?? 0),
                        sellId: dataDeleteSell.SellId,
                        storeId: dataDeleteSell.UserId
                    }
                })
            }
            if (dataDeleteSell.removeTransaction) {
                const deleteTransaction = await prismaTx.transactions.deleteMany({
                    where: {
                        AND: [
                            { storeId: dataDeleteSell.UserId },
                            { sellId: dataDeleteSell.SellId }
                        ]
                    }
                })
                if (deleteTransaction.count === 0) {
                    throw new Error('Falha ao remover recebimento!')
                }
            }
            if (deleteSellonDB.count <= 0) {
                response.json({ Success: false, erro: "Nenhum registro encontrado com os parametros fornecidos" })
            } else {
                response.json({ Success: true, deleteSellonDB })
            }
        })
    }
    catch (error) {

        return response.status(400).json({ Success: false, erro: error.message })

    }
}