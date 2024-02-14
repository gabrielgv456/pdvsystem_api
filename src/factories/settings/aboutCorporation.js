// @ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function aboutCorporation(request, response) {
    try {
        const { storeId } = request.query
        if (!storeId) {
            throw new Error('Informe o storeId!')
        }

        const resultAboutCorporation = await prisma.user.findUnique({
            where: {
                id: parseInt(storeId.toString())
            }, select: {
                email: true,
                name: true,
                phone: true,
                adressCep: true,
                adressNeighborhood: true,
                adressNumber: true,
                adressState: true,
                adressStreet: true,
                adressCity: true,
                cellPhone: true,
                fantasyName: true,
                cnpj: true,
                ie: true
            }
        })
        if (!resultAboutCorporation) {
            throw new Error('Falha ao localizar dados sobre a empresa!')
        }
        return response.json({ Success: true, resultAboutCorporation })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}