const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const prisma = require('../../services/prisma')

module.exports = async function signIn(request, response) {
    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        const updatetoken = await prisma.user.update({ where: { email: email }, data: { Token: uuidGenerated } })
        const validateUser = await prisma.user.findUnique({ where: { email: email }, select: {
            adressCep: true, adressCity: true, adressNeighborhood: true, adressNumber: true,
            adressState: true, adressStreet: true, cellPhone: true, cnpj: true, email: true, id: true, name: true,
            phone: true, Token: true, urlLogo: true
        } })

        if (validateUser === null) {
            return response.json({ erro: "Não foi encontrado usuarios com esse email" })
        }
        else {
            if (await bcrypt.compare(password, validateUser.password)) {
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