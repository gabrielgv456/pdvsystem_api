import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function findCfop(request: Request, response: Response) {
    try {
        const findCfop = await prisma.taxCfop.findMany()
        if (!findCfop) {
            throw new Error('Falha ao obter lista do Cfop!')
        }
        return response.json({ Success: true, findCfop })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}