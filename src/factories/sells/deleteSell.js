const prisma = require('../../services/prisma')

module.exports = async function deleteSell(request, response) {

    const { dataDeleteSell } = request.body

    try {

        dataDeleteSell.Products.map(async product => {
            const searchProduct = await prisma.products.findUnique({
                where: {
                    id: product.idProduct
                }
            })
            const updateQntProduct = await prisma.products.update({
                where: {
                    id: searchProduct.id
                },
                data: {
                    quantity: searchProduct.quantity + product.quantity
                }
            })
            const addTransaction = await prisma.transactionsProducts.create({
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


        const deleteSellonDB = await prisma.sells.updateMany({

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

        const deleteItensSellonDB = await prisma.itensSell.updateMany({
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

        if (dataDeleteSell.AddExitTransaction) {
            const AddExitTransactionDb = await prisma.transactions.create({
                data: {
                    description: 'Estorno de Venda',
                    type: 'exit',
                    value: dataDeleteSell.SellValue,
                    sellId: dataDeleteSell.SellId,
                    storeId: dataDeleteSell.UserId
                }
            })
        }
        if (dataDeleteSell.removeTransaction) {
            const deleteTransaction = await prisma.transactions.deleteMany({
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
    }
    catch (error) {

        return response.status(400).json({ Success: false, erro: error.message })

    }
}