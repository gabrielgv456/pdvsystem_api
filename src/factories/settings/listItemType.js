//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function listItemType(request, response) {
    try {
        const findItemType = await prisma.taxItemType.findMany()
        if (findItemType) {
            return response.json({ Success: true, findItemType })
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}
