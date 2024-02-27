// @ts-check

import validateFields from '../../utils/validateFields.js';
import prisma from '../../services/prisma/index.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function addProduct(request, response) {

    try {
        const dataAddProduct = request.body.principal
        const requiredFields = ['userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement']
        validateFields(requiredFields, dataAddProduct)
        await prisma.$transaction(async (prismaTx) => {
            const verifyCodRefExists = await prismaTx.products.findMany({
                where: {
                    codRef: dataAddProduct.codRef
                }
            })
            if (verifyCodRefExists.length > 0) {
                throw new Error(`Já existe produto cadastrado com o código de referência ${dataAddProduct.codRef}`)
            }

            const addproduct = await prismaTx.products.create({
                data: {
                    name: dataAddProduct.name,
                    codRef: dataAddProduct.codRef,
                    exTipi: dataAddProduct.exTipi,
                    brand: dataAddProduct.brand,
                    value: dataAddProduct.value,
                    storeId: dataAddProduct.userId,
                    quantity: dataAddProduct.quantity,
                    active: dataAddProduct.active,
                    cost: dataAddProduct.cost,
                    profitMargin: dataAddProduct.profitMargin,
                    barCode: dataAddProduct.barCode,
                    ncmCode: dataAddProduct.ncmCode,
                    cfopId: dataAddProduct.cfopId,
                    unitMeasurement: dataAddProduct.unitMeasurement,
                    itemTypeId: dataAddProduct.itemTypeId,
                }
            })

            await prismaTx.transactionsProducts.create({
                data: {
                    type: "E",
                    description: "Criação do produto",
                    totalQuantity: dataAddProduct.quantity,
                    quantity: dataAddProduct.quantity,
                    productId: addproduct.id,
                    storeId: dataAddProduct.userId
                }
            })
            return response.json({ Success: true })
        })
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}