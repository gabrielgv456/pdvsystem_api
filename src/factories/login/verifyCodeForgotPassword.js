const bcrypt = require('bcrypt')
const prisma = require('../../services/prisma');
const validateFields = require('../../utils/validateFields');

module.exports = async function verifyCodeForgotPassword(request, response) {
    try {
        validateFields(['email', 'codEmailValidate'], request.query)

        const { email, codEmailValidate } = request.query;
        const findUser = await prisma.user.findUnique({ where: { email } })

        if (findUser === null) {
            throw new Error("Não foi encontrado usuarios com esse id")
        }
        if (!findUser.codEmailPass === codEmailValidate) {
            throw new Error("Código de validação incorreto!")
        }

        return response.json({ Success: true })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}