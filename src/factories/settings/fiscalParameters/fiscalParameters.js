//@ts-check

import prisma from '../../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function fiscalParameters(request, response) {
    try {
        const { storeId } = request.query
        if (!storeId) {
            throw new Error('Informe o storeId!')
        }

        const fiscalParameters = await prisma.user.findUnique({
            where: {
                id: parseInt(storeId.toString())
            },
            select: {
                taxCrtId: true,
                taxRegimeId: true,
                taxCstPisId: true,
                taxCstPisAliquot: true,
                taxCstCofinsAliquot: true,
                taxCstCofinsId: true
            }
        })
        const crtOptions = await prisma.taxCrt.findMany()
        const cstCofinsOptions = await prisma.taxCstCofins.findMany()
        const cstPisOptions = await prisma.taxCstPis.findMany()
        const regimeOptions = await prisma.taxRegime.findMany()

        return response.json({ Success: true, fiscalParameters, crtOptions, cstCofinsOptions, cstPisOptions, regimeOptions })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}