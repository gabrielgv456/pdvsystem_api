//@ts-check

import prisma from '../../services/prisma/index.js'
import validateFields from '../../utils/validateFields.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

module.exports = async function addDelivery(request, response) {
    const dataAddDelivery = request.body
    try {
        const requiredFields = ['storeId']
        validateFields(requiredFields, dataAddDelivery)
        const addDelivery = prisma.$transaction(async (tx) => {
            tx.deliveries
        })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}