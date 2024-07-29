import { Request, Response } from 'express'
import prisma from '../../services/prisma/index'
import validateFields from '../../utils/validateFields'

export default async function addDelivery(request:Request, response : Response) {
    const dataAddDelivery = request.body
    try {
        const requiredFields = ['storeId']
        validateFields(requiredFields, dataAddDelivery)
        prisma.$transaction(async (tx) => {
            tx.deliveries
        })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}