// @ts-check

import prisma from '../../services/prisma/index.js';
import validateFields from '../../utils/validateFields.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */


export default async function editClient(request, response) {

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
            'taxRegimeId',
            'finalCostumer'
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
            taxRegimeId,
            finalCostumer } = request.body

        if (!idClient) { throw new Error('Informe o valor do idClient!') }
        if (!storeId) { throw new Error('Informe o valor do storeId!') }

        const existsClient = await prisma.clients.findMany({
            where: {
                AND:
                    [
                        { cpf },
                        { storeId }
                    ], NOT: [
                        { id: idClient }
                    ]
            },
            select: {
                id: true
            }
        })
        if (existsClient.length > 0)
            throw new Error('Já existe cliente com o documento ' + cpf)

        const editClient = await prisma.clients.update({
            where: {
                id_storeId: {
                    id: idClient,
                    storeId
                }
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
                taxRegimeId,
                finalCostumer
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