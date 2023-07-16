const prisma = require('../../services/prisma')

module.exports = async function addSell(request, response) {
    try {
        const { sell } = request.body

        const createSellonDB = await prisma.sells.create({
            data: {
                storeId: sell.UserId,
                sellValue: sell.totalValue,
                cost: sell.totalCost,
                valuePayment: sell.valuePayment,
                clientId: sell.clientId,
                sellerId: sell.sellerId
            }
        })

        await sell.Products.map(async (product) => {

            const searchProduct = await prisma.products.findUnique({
                where: {
                    id: product.id
                }
            })
            if (product.quantity > searchProduct.quantity) {
                return ('quantidade maior do que o saldo')

            } else {
                const updateQuantityProduct = await prisma.products.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        quantity: searchProduct.quantity - product.quantity
                    }

                })

                const createTransactionProduct = await prisma.transactionsProducts.create({
                    data: {
                        type: "S",
                        description: "Venda",
                        totalQuantity: searchProduct.quantity - product.quantity,
                        quantity: product.quantity,
                        productId: searchProduct.id,
                        storeId: searchProduct.storeId
                    }
                })
            }
        })


        await sell.Products.map(async (product) => {
            const createItensSellonDB = await prisma.itensSell.create({
                data: {
                    storeId: sell.UserId,
                    sellId: createSellonDB.id,
                    idProduct: product.id,
                    quantity: product.quantity,
                    valueProduct: product.initialvalue,
                    totalValue: product.totalvalue,
                    costProduct: product.initialCost,
                    totalCost:product.totalCost,
                    descriptionProduct: product.name
                }
            });
            console.log("Created Products")
        })

        await sell.Payment.map(async (payment) => {
            const createPaymentSellonDB = await prisma.paymentSell.create({
                data: {
                    storeId: sell.UserId,
                    sellId: createSellonDB.id,
                    typepayment: payment.type,
                    value: payment.value
                }
            });
            console.log("Created Payment")
            const createPaymentTransaction = await prisma.transactions.create({
                data: {
                    type: payment.type,
                    description: "Recebimento de venda",
                    value: payment.value,
                    sellId: createSellonDB.id,
                    storeId: sell.UserId
                }
            })
        })

        if (sell.changeValue) {
            const createChangeTransaction = await prisma.transactions.create({
                data: {
                    type: 'exit_change',
                    description: 'Troco de venda',
                    value: sell.changeValue,
                    sellId: createSellonDB.id,
                    storeId: sell.UserId
                }
            })
        }
        return response.json({ Success: true })
    }

    catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }

}