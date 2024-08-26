import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'
import { sharedErrorValidate, sharedValidate } from '@shared/api/login/validate'

export default async function validate(request: Request, response: Response) {
    try {
        const { token } = request.body

        const validateUser = await prisma.user.findUnique({
            where: { Token: token }, select: {
                addressRelation: { include: { city: { include: { state: true } } } },
                cellPhone: true, cnpj: true, email: true, id: true, name: true,
                phone: true, Token: true, urlLogo: true, masterkey: true,
                plans: true
            },
        })

        if (!validateUser?.Token) { throw new Error('Token não encotrado') }
        if (validateUser.Token !== token) { throw new Error('Token inválido') }

        const result: sharedValidate = {
            valid: true,
            user: validateUser,
            token: validateUser.Token
        }

        return response.status(200).json(result)

    }
    catch (error) {
        const result: sharedErrorValidate = { valid: false, error_message: "Token Invalido", error: (error as Error).message }
        return response.status(400).json(result)
    }
}