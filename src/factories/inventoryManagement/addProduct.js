// @ts-check

import validateFields from '../../utils/validateFields.js';
import prisma from '../../services/prisma/index.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function addProduct(request, response) {
    
    const { dataAddProduct } = request.body

    try {
        const requiredFields = ['userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement']
        validateFields(requiredFields,dataAddProduct)

        const addproduct = await prisma.products.create({
            data: {
                name: dataAddProduct.name,
                value: dataAddProduct.value,
                storeId: dataAddProduct.userId,
                quantity: dataAddProduct.quantity,
                active: dataAddProduct.active,
                cost: dataAddProduct.cost,
                profitMargin: dataAddProduct.profitMargin,
                barCode: dataAddProduct.barCode,
                ncmCode: dataAddProduct.ncmCode,
                itemTypeId: dataAddProduct.itemTypeId,
                cfopId: dataAddProduct.cfopId,
                unitMeasurement: dataAddProduct.unitMeasurement
            }
        })

        const createTransactionProduct = await prisma.transactionsProducts.create({
            data: {
                type: "E",
                description: "Criação do produto",
                totalQuantity: dataAddProduct.quantity,
                quantity: dataAddProduct.quantity,
                productId: addproduct.id,
                storeId: dataAddProduct.userId
            }
        })
        return response.json({ Sucess: true })
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}