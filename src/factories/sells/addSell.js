const prisma = require('../../services/prisma')

module.exports = async function addSell(request, response) {
    try {
        const { sell } = request.body
        console.log(sell)

        await prisma.$transaction(async (prismaTx) => {

            const nextCodRefSell = await prismaTx.sells.findFirst({
                orderBy: {
                    id: 'desc'
                }, select: {
                    codRef: true
                }
            })

            const createSellonDB = await prismaTx.sells.create({
                data: {
                    storeId: sell.UserId,
                    sellValue: sell.totalValue,
                    discountValue: sell.totalDiscount,
                    cost: sell.totalCost,
                    valuePayment: sell.valuePayment,
                    clientId: sell.clientId,
                    sellerId: sell.sellerId,
                    codRef: (nextCodRefSell.codRef ?? 1000) + 1
                }
            })

            //  await sell.Products.map(async (product) => {
            for (const product of sell.Products) {

                const searchProduct = await prismaTx.products.findUnique({
                    where: {
                        id: product.id
                    }
                })
                if (product.quantity > searchProduct.quantity) {
                    throw new Error('Quantidade maior do que o saldo!')

                } else {
                    const updateQuantityProduct = await prismaTx.products.update({
                        where: {
                            id: product.id
                        },
                        data: {
                            quantity: searchProduct.quantity - product.quantity
                        }

                    })

                    const createTransactionProduct = await prismaTx.transactionsProducts.create({
                        data: {
                            type: "S",
                            description: "Venda nº " + createSellonDB.codRef,
                            totalQuantity: searchProduct.quantity - product.quantity,
                            quantity: product.quantity,
                            productId: searchProduct.id,
                            storeId: searchProduct.storeId
                        }
                    })
                }
            }

            //await sell.Products.map(async (product) => {
            for (const product of sell.Products) {
                const createItensSellonDB = await prismaTx.itensSell.create({
                    data: {
                        storeId: sell.UserId,
                        sellId: createSellonDB.id,
                        idProduct: product.id,
                        quantity: product.quantity,
                        valueProduct: product.initialvalue - product.discountValue,
                        totalValue: product.totalvalue - product.totalDiscount,
                        costProduct: product.initialCost,
                        totalCost: product.totalCost,
                        descriptionProduct: product.name,
                        discount: product.discountValue,
                        totalDiscount: product.totalDiscount
                    }
                });

                if (sell.isDelivery) {

                    const deliveryAddress = await prismaTx.address.create({
                        data: {
                            addressTypeId: 1,
                            addressCep: sell.delivery.addressCep,
                            addressCity: sell.delivery.addressCity,
                            addressComplement: sell.delivery.addressComplement,
                            addressNeighborhood: sell.delivery.addressNeighborhood,
                            addressNumber: sell.delivery.addressNumber,
                            addressState: sell.delivery.addressState,
                            addressStreet: sell.delivery.addressStreet,
                            storeId: sell.UserId
                        }
                    })
                    await prismaTx.deliveries.create({
                        data: {
                            scheduledDate: sell.delivery.scheduledDate,
                            status: 'Pending',
                            storeId: sell.UserId,
                            itemSellId: createItensSellonDB.id,
                            clientId: sell.clientId,
                            productId: createItensSellonDB.idProduct,
                            addressId: deliveryAddress.id,
                            sellId: createItensSellonDB.sellId
                        }
                    })
                }
                console.log("Created Products")
            }

            //await sell.Payment.map(async (payment) => {
            for (const payment of sell.Payment) {
                const createPaymentSellonDB = await prismaTx.paymentSell.create({
                    data: {
                        storeId: sell.UserId,
                        sellId: createSellonDB.id,
                        typepayment: payment.type,
                        value: payment.value
                    }
                });

                console.log("Created Payment")
                if (payment.type !== 'onDelivery') {
                    const createPaymentTransaction = await prismaTx.transactions.create({
                        data: {
                            type: payment.type,
                            description: "Recebimento de venda nº " + createSellonDB.codRef,
                            value: payment.value,
                            sellId: createSellonDB.id,
                            storeId: sell.UserId
                        }
                    })
                } else {
                    await prismaTx.deliveries.updateMany({
                        where: { itemSell: { sell: { id: createSellonDB.id } } },
                        data: { onDeliveryPayValue: payment.value }
                    })
                }
            }

            if (sell.changeValue) {
                const createChangeTransaction = await prismaTx.transactions.create({
                    data: {
                        type: 'exit_change',
                        description: 'Troco de venda nº ' + createSellonDB.codRef,
                        value: sell.changeValue,
                        sellId: createSellonDB.id,
                        storeId: sell.UserId
                    }
                })
            }



            return response.json({ Success: true, codRef: createSellonDB.codRef })
        })
    }

    catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }

}
