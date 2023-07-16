const validateFields = require('../../utils/validateFields');
const prisma = require('../../services/prisma')

module.exports = async function editProduct(request, response) {

    const { dataEditProduct } = request.body

    try {

        requiredFields = ['id', 'userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement']
        validateFields(requiredFields, dataEditProduct)

        const searchProduct = await prisma.products.findUnique({
            where: { id: dataEditProduct.id }
        })

        try {
            const editproduct = await prisma.products.updateMany({

                where: {
                    AND: [
                        { id: dataEditProduct.id },
                        { storeId: dataEditProduct.userId }
                    ]
                },

                data: {
                    name: dataEditProduct.name,
                    value: dataEditProduct.value,
                    quantity: dataEditProduct.quantity,
                    active: dataEditProduct.active,
                    barCode: dataEditProduct.barCode,
                    cfopId: dataEditProduct.cfopId,
                    cost: dataEditProduct.cost,
                    //itemTypeId: dataEditProduct.itemTypeId,
                    ncmCode: dataEditProduct.ncmCode,
                    profitMargin: dataEditProduct.profitMargin,
                    unitMeasurement: dataEditProduct.unitMeasurement
                }
            })


            if (editproduct.count <= 0) {
                throw new Error("Nenhum registro encontrado com as codições informadas");
            }
            else {
                if (searchProduct.quantity > dataEditProduct.quantity) {

                    try {
                        const createTransactionEditProduct = await prisma.transactionsProducts.create({
                            data: {
                                type: "S",
                                description: "Ajuste de estoque",
                                totalQuantity: dataEditProduct.quantity,
                                quantity: searchProduct.quantity - dataEditProduct.quantity,
                                productId: dataEditProduct.id,
                                storeId: dataEditProduct.userId
                            }
                        })
                        if (createTransactionEditProduct && editproduct) {
                            return response.json({
                                Sucess: true
                            })
                        }
                    }
                    catch (error) {
                        throw new Error("Falha ao criar transação !" + error.message)
                    }

                }
                if (searchProduct.quantity < dataEditProduct.quantity) {

                    try {
                        const createTransactionEditProduct = await prisma.transactionsProducts.create({
                            data: {
                                type: "E",
                                description: "Ajuste de estoque",
                                totalQuantity: dataEditProduct.quantity,
                                quantity: dataEditProduct.quantity - searchProduct.quantity,
                                productId: dataEditProduct.id,
                                storeId: dataEditProduct.userId
                            }
                        })
                        if (createTransactionEditProduct && editproduct) {
                            return response.json({
                                Sucess: true
                            })
                        }
                    }
                    catch (error) {
                        throw new Error("Falha ao criar transação! " + error.message)
                    }

                }
                if (searchProduct.quantity === dataEditProduct.quantity) {
                    if (editproduct.count > 0) {
                        return response.json({
                            Sucess: true
                        })
                    }

                }
            }
        }
        catch (error) {
            throw new Error("Falha ao editar produto " + error.message)
        }

    }
    catch (error) {
        return response.status(400).json({ Sucess: false, erro: error.message, message: "Falha ao localizar produto" })
    }
}