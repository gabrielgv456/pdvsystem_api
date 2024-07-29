import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function listItemType(request: Request, response: Response) {
    try {
        const findItemType = await prisma.taxItemType.findMany()
        if (findItemType) {
            return response.json({ Success: true, findItemType })
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}
