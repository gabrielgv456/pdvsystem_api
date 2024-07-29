import { hash } from 'bcrypt';
import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'

export default async function changeForgotPassword(request: Request, response: Response) {
    try {
        validateFields(['email', 'codEmailValidate', 'newPass'], request.body)

        const { email, codEmailValidate, newPass } = request.body;
        const findUser = await prisma.user.findUnique({ where: { email } })
        const hashedPassword = await hash(newPass, 11)

        if (findUser === null) {
            throw new Error("Não foi encontrado usuarios com esse id")
        }
        if (!findUser.codEmailPass === codEmailValidate) {
            throw new Error("Código de validação incorreto!")
        }
        const changePassWord = await prisma.user.update({
            where: { id: findUser.id },
            data: { password: hashedPassword , codEmailPass: null }
        })
        if (changePassWord) {
            return response.json({ Success: true })
        } else {
            throw new Error("Falha ao atualizar senha!")
        }

    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}