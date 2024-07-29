import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function deleteSell(request: Request, response: Response) {

    const { datafindTransactions } = request.body
    try {
        const findtransactions = await prisma.transactions.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    storeId: datafindTransactions.userID,
                    created_at: {
                        gt: new Date(datafindTransactions.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindTransactions.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindTransactions.userId }

                ]
            }
        })

        return response.json(findtransactions)
    }
    catch (error) {
        return response.status(400).json({ erro: (error as Error).message })

    }

}