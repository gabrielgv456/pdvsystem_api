import prisma from "../../services/prisma/index"
import validateFields from "../../utils/validateFields"
import { Request, Response } from 'express'

export default async function deleteLogo(request: Request, response: Response) {
    try {
        validateFields(['storeId'], request.query)
        if (!request.query.storeId) { throw new Error('storeId não informado!') }
        await prisma.user.update({
            where: {
                id: parseInt(request.query.storeId?.toString())
            },
            data: {
                urlLogo: null
            }
        })
        response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}