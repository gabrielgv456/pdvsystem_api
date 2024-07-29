import { v4 } from 'uuid'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'


export default async function logout(request: Request, response: Response) {
    
    const { userId } = request.body.dataLogOutUser
    const uuidGenerated = v4()

    try {
        const logoutUserDb = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                Token: uuidGenerated
            }
        })
        if (logoutUserDb) {
            return response.json({ Success: true })
        }
        else {
            return response.json({ Success: false, erro: 'Falha ao atualizar Token' })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error })
    }
}