import { hash, compare } from 'bcrypt';
import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'

export default async function changePass(request: Request, response: Response) {
    try {
        const { storeId, actualPass, newPass } = request.body.data;
        validateFields(['storeId', 'actualPass', 'newPass'], request.body.data, true)
        const findUser = await prisma.user.findUnique({ where: { id: storeId } })
        
        if (!findUser) {
            throw new Error("Não foi encontrado usuarios com esse id")
        }
        const hashedPassword = await hash(newPass, 11)
        if (await compare(actualPass, findUser.password)) {
            const changePassWord = await prisma.user.update({
                where: { id: storeId },
                data: { password: hashedPassword }
            })
            if (changePassWord) {
                return response.json({ Success: true })
            } else {
                throw new Error("Falha ao atualizar senha!")
            }
        } else {
            throw new Error("Senha atual incorreta!")
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}