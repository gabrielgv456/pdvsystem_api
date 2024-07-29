import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'


export default async function findDeliveries(request:Request, response : Response) {
    try {
        const dataFindDeliveries = request.query
        const requiredFields = ['storeId', 'initialDate', 'finalDate']
        validateFields(requiredFields, dataFindDeliveries, true)
        if (!dataFindDeliveries.storeId?.toString()) {throw new Error('storeId não informado!')}

        const resultDeliveries = await prisma.deliveries.findMany({
            include: {
                address: true,
                client: true,
                itemSell: { include: { sell: true } }
            },
            orderBy: { id: 'asc' },
            where: {
                AND: [{
                    scheduledDate: {
                        gt: new Date(`${dataFindDeliveries.initialDate}T00:00:00Z`)
                    }
                },
                {
                    scheduledDate: {
                        lt: new Date(`${dataFindDeliveries.finalDate}T23:59:59Z`)
                    }
                },
                { storeId: parseInt(dataFindDeliveries.storeId.toString()) }
                ]
            }
        })
        return response.json({ Success: true, resultDeliveries })
    }
    catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }
}