import { v4 } from 'uuid'
import { compare } from 'bcrypt'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'
import { sharedErrorSignInResponse, sharedSignInSuccessResponse } from '@shared/api/login/sign'

export default async function signIn(request: Request, response: Response) {
    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        const validateUser = await prisma.user.findUnique({
            where: { email: email }, select: {
                addressRelation: { include: { city: { include: { state: true } } } },
                cellPhone: true, cnpj: true, email: true, id: true, name: true,
                phone: true, Token: true, urlLogo: true, masterkey: true, password: true,
                plans: true, codEmailValidate: true, isEmailValid: true
            }
        })

        if (!validateUser) throw new Error("Não foi encontrado usuários com esse email")

        if (await compare(password, validateUser.password)) {
            await prisma.user.update({ where: { email: email }, data: { Token: uuidGenerated } })
            const { password, ...rest } = validateUser
            const result: sharedSignInSuccessResponse = {
                Success: true,
                user: rest,
                token: uuidGenerated
            }
            return response.json(result)
        }
        else {
            throw new Error("Senha incorreta")
        }

    } catch (error) {
        const result: sharedErrorSignInResponse = { Success: false, erro: error.message }
        return response.status(400).json()
    }
}