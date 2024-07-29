import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function deleteSeller(request: Request, response: Response) {
    const { dataDeleteSeller } = request.body

    try {
        const deleteSellerDb = await prisma.sellers.deleteMany({
            where: {
                AND: [
                    { id: dataDeleteSeller.sellerId },
                    { storeId: dataDeleteSeller.userId }
                ]
            }
        })
        if (deleteSellerDb.count > 0) {
            return response.json({ Success: true })
        }
        else if (deleteSellerDb.count <= 0) {
            return response.json({ Success: false, erro: 'Nenhum registro encontrado com os parametros fornecidos' })
        }
    }
    catch (error) {

        return response.status(400).json({ Success: false, erro: (error as Error).message })

    }
}