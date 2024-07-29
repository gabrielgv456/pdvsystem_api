import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function addTransaction(request: Request, response: Response) {
    const { dataAddTransaction } = request.body

    try {
        await prisma.transactions.create({
            data: {
                type: dataAddTransaction.type,
                description: dataAddTransaction.description,
                value: dataAddTransaction.value,
                storeId: dataAddTransaction.UserId
            }
        })
        return response.json({ Success: true })

    } catch (error) {

        return response.status(400).json({ Success: false, Erro: (error as Error).message })

    }
}