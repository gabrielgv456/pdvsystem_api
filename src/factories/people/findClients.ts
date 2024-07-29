import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function findClients(request: Request, response: Response) {

    try {
        const { userId } = request.body
        if (!userId) { throw new Error('Informe o userId') }
        const findClients = await prisma.clients.findMany({
            orderBy: {
                name: 'asc'
            },
            where: {
                storeId: userId
            }
        })
        return response.json({ Success: true, findClients })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }

}