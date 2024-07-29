import { Request, Response } from 'express'
import prisma from '../../services/prisma/index'

export default async function deleteClient(request: Request, response: Response) {

    const { dataDeleteClient } = request.body

    try {
        const deleteClientDb = await prisma.clients.deleteMany({
            where: {
                AND: [{
                    storeId: dataDeleteClient.userId,
                    id: dataDeleteClient.clientId
                }]
            }
        })
        if (deleteClientDb.count <= 0) {
            return response.json({ Success: false, erro: "Nenhum registro encontrado" })
        }
        else if (deleteClientDb.count > 0) {
            return response.json({ Success: true })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }


}