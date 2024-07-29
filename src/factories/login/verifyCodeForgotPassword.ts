import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'

export default async function verifyCodeForgotPassword(request: Request, response: Response) {
    try {
        validateFields(['email', 'codEmailValidate'], request.query)

        const { email, codEmailValidate } = request.query;
        const findUser = await prisma.user.findUnique({ where: { email: email?.toString() } })

        if (!findUser) {
            throw new Error("Não foi encontrado usuarios com esse email")
        }
        if (findUser.codEmailPass !== codEmailValidate?.toString()) {
            throw new Error("Código de validação incorreto!")
        }

        return response.json({ Success: true })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}