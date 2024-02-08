// @ts-check
const prisma = require('../../services/prisma')

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

module.exports = async function addClient(request, response) {

    const { email,
        adressCep,
        adressCity,
        active,
        adressComplement,
        adressNeighborhood,
        adressNumber,
        adressState,
        adressStreet,
        birthDate,
        cellNumber,
        cpf,
        gender,
        name,
        phoneNumber,
        storeId,
        ie,
        suframa,
        taxPayerTypeId,
        taxRegimeId } = request.body

    try {
        const addClient = await prisma.clients.create({
            data: {
                email,
                adressCep,
                adressCity,
                active,
                adressComplement,
                adressNeighborhood,
                adressNumber,
                adressState,
                adressStreet,
                birthDate,
                cellNumber,
                cpf,
                gender,
                name,
                phoneNumber,
                storeId,
                ie,
                suframa,
                taxPayerTypeId,
                taxRegimeId
            }
        })
        if (addClient) {
            console.log({ dataClient: addClient })
            return response.json({ Success: true, dataClient: addClient })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}