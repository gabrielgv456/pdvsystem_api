import { v4 } from 'uuid'
import { compare } from 'bcrypt'
import prisma from '../../services/prisma/index.js'

export default async function signIn(request, response) {
    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        const updatetoken = await prisma.user.update({ where: { email: email }, data: { Token: uuidGenerated } })
        const validateUser = await prisma.user.findUnique({ where: { email: email } })

        if (validateUser === null) {
            return response.json({ erro: "Não foi encontrado usuarios com esse email" })
        }
        else {
            if (await compare(password, validateUser.password)) {
                delete validateUser.password
                return response.json({
                    user: validateUser,
                    token: validateUser.Token
                })
            }
            else {
                return response.json({ Success: false, erro: "Senha incorreta" })
            }
        }


    } catch (error) {
        return response.status(400).json({ error_message: "Usuario não encontrado", error })
    }
}