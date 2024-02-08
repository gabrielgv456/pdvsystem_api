// @ts-check

const prisma = require('../../services/prisma');
const validateFields = require('../../utils/validateFields');

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */


module.exports = async function editClient(request, response) {

    try {
        const requiredFields = [
            'idClient',
            'email',
            'adressCep',
            'adressCity',
            'active',
            'adressComplement',
            'adressNeighborhood',
            'adressNumber',
            'adressState',
            'adressStreet',
            'birthDate',
            'cellNumber',
            'cpf',
            'gender',
            'name',
            'phoneNumber',
            'storeId',
            'ie',
            'suframa',
            'taxPayerTypeId',
            'taxRegimeId'
        ];

        validateFields(requiredFields, request.body)

        const { idClient,
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
            taxRegimeId } = request.body

        if (!idClient) { throw new Error('Informe o valor do idClient!') }
        if (!storeId) { throw new Error('Informe o valor do storeId!') }
        
        const editClient = await prisma.clients.updateMany({
            where: {
                AND:
                    [
                        { id: idClient },
                        { storeId }
                    ]
            },
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
        if (editClient) {
            return response.json({ Success: true, dataClient: editClient })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}