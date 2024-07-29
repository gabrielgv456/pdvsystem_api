import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

type productsType = {
    id: number;
    storeId: number;
    sellId: number;
    idProduct: number;
    quantity: number;
    valueProduct: number;
    totalValue: number;
    descriptionProduct: string;
    created_at: Date;
}

type deleteSellType = {
    SellId: number,
    UserId: number,
    Products: productsType[],
    AddExitTransaction: boolean,
    removeTransaction: boolean
    SellValue: number
}

export default async function deleteSell(request: Request, response: Response) {

    const dataDeleteSell: deleteSellType = request.body.dataDeleteSell

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


            const deleteSellonDB = await prismaTx.sells.update({

                where: {
                    id_storeId: {
                        id: dataDeleteSell.SellId,
                        storeId: dataDeleteSell.UserId
                    }
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
            if (!deleteSellonDB) {
                response.json({ Success: false, erro: "Nenhum registro encontrado com os parametros fornecidos" })
            } else {
                response.json({ Success: true, deleteSellonDB })
            }
        })
    }
    catch (error) {

        return response.status(400).json({ Success: false, erro: (error as Error).message })

    }
}