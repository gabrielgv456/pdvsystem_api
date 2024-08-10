import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function validate(request: Request, response: Response) {
    try {
        const { token } = request.body

        const validateUser = await prisma.user.findFirst({
            where: { Token: token }, select: {
                address: { include: { city: { include: { state: true } } } }, cellPhone: true, cnpj: true, email: true, id: true, name: true,
                phone: true, Token: true, urlLogo: true, masterkey: true
            }
        })

        if (!validateUser?.Token) { throw new Error('Token não encotrado') }
        if (validateUser.Token !== token) { throw new Error('Token inválido') }

        return response.status(200).json({
            valid: true,
            user: validateUser,
            token: validateUser.Token
        })

    }
    catch (error) {
        return response.status(400).json({ valid: false, error_message: "Token Invalido", error: (error as Error).message })
    }
}