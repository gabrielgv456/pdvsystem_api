//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function addTransaction(request, response) {
    const { dataAddTransaction } = request.body

    try {
        const createPaymentTransaction = await prisma.transactions.create({
            data: {
                type: dataAddTransaction.type,
                description: dataAddTransaction.description,
                value: dataAddTransaction.value,
                storeId: dataAddTransaction.UserId
            }
        })
        return response.json({ Sucess: true })

    } catch (error) {

        return response.status(400).json({ Sucess: false, Erro: error.message })

    }
}