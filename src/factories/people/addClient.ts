import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function addClient(request: Request, response: Response) {

    try {
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
            taxRegimeId,
            finalCostumer } = request.body

        const existsClient = await prisma.clients.findMany({
            where: {
                AND:
                    [
                        { cpf },
                        { storeId }
                    ]
            },
            select: {
                id: true
            }
        })
        if (existsClient.length > 0)
            throw new Error('Já existe cliente com o documento ' + cpf)

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
                taxRegimeId,
                finalCostumer
            }
        })
        if (addClient) {
            return response.json({ Success: true, dataClient: addClient })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}