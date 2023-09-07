const bcrypt = require('bcrypt')
const prisma = require('../../services/prisma');
const validateFields = require('../../utils/validateFields');

module.exports = async function changeForgotPassword(request, response) {
    try {
        validateFields(['email', 'codEmailValidate', 'newPass'], request.body)

        const { email, codEmailValidate, newPass } = request.body;
        const findUser = await prisma.user.findUnique({ where: { email } })
        const hashedPassword = await bcrypt.hash(newPass, 11)

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
        return response.status(400).json({ Success: false, erro: error.message })
    }
}