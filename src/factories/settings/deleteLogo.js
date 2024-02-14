//@ts-check

import prisma from "../../services/prisma/index.js"
import validateFields from "../../utils/validateFields.js"

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function deleteLogo(request, response) {
    try {
        validateFields(['storeId'], request.query)
        if (!request.query.storeId) { throw new Error('storeId não informado!') }
        await prisma.user.update({
            where: {
                id: parseInt(request.query.storeId?.toString())
            },
            data: {
                urlLogo: null
            }
        })
        response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}