//@ts-check

import validateFields from '../../utils/validateFields.js';
import prisma from '../../services/prisma/index.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * 
 */

export default async function editProduct(request, response) {

    try {

        const dataEditProduct = request.body.principal

        const requiredFields = ['id', 'userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement']
        validateFields(requiredFields, dataEditProduct)

        const searchProduct = await prisma.products.findUnique({
            where: { id: dataEditProduct.id }
        })

        if (!searchProduct) { throw new Error(`Não foi encontrado produto com o id ${dataEditProduct.id}`) }

        if (searchProduct.codRef !== dataEditProduct.codRef) {
            const searchCodProduct = await prisma.products.findMany({
                where: { codRef: dataEditProduct.codRef }
            })

            if (searchCodProduct.length > 0) { throw new Error(`Já existe produto cadastrado com o código de referência ${dataEditProduct.codRef}`) }
        }

        await prisma.$transaction(async (prismaTx) => {

            const editproduct = await prismaTx.products.updateMany({

                where: {
                    AND: [
                        { id: dataEditProduct.id },
                        { storeId: dataEditProduct.userId }
                    ]
                },

                data: {
                    name: dataEditProduct.name,
                    codRef: dataEditProduct.codRef,
                    exTipi: dataEditProduct.exTipi,
                    brand: dataEditProduct.brand,
                    value: dataEditProduct.value,
                    storeId: dataEditProduct.userId,
                    quantity: dataEditProduct.quantity,
                    active: dataEditProduct.active,
                    cost: dataEditProduct.cost,
                    profitMargin: dataEditProduct.profitMargin,
                    barCode: dataEditProduct.barCode,
                    ncmCode: dataEditProduct.ncmCode,
                    cfopId: dataEditProduct.cfopId,
                    unitMeasurement: dataEditProduct.unitMeasurement,
                    itemTypeId: dataEditProduct.itemTypeId,
                }
            })


            if (editproduct.count <= 0) {
                throw new Error("Nenhum registro encontrado com as codições informadas");
            }
            else {
                if (searchProduct.quantity > dataEditProduct.quantity) {
                    await prismaTx.transactionsProducts.create({
                        data: {
                            type: "S",
                            description: "Ajuste de estoque",
                            totalQuantity: dataEditProduct.quantity,
                            quantity: searchProduct.quantity - dataEditProduct.quantity,
                            productId: dataEditProduct.id,
                            storeId: dataEditProduct.userId
                        }
                    })

                }
                if (searchProduct.quantity < dataEditProduct.quantity) {
                    await prismaTx.transactionsProducts.create({
                        data: {
                            type: "E",
                            description: "Ajuste de estoque",
                            totalQuantity: dataEditProduct.quantity,
                            quantity: dataEditProduct.quantity - searchProduct.quantity,
                            productId: dataEditProduct.id,
                            storeId: dataEditProduct.userId
                        }
                    })
                }
            }
        })
        return response.json({ Success: true })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}