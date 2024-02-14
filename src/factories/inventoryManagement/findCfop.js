//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function findCfop(request, response) {
    try {
        const findCfop = await prisma.taxCfop.findMany()
        if (!findCfop) {
            throw new Error('Falha ao obter lista do Cfop!')
        }
        return response.json({ Success: true, findCfop })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}