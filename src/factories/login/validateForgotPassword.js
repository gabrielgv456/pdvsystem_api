const validateFields = require("../../utils/validateFields")
const sendEmailChangePass = require('../../services/mail')
const prisma = require('../../services/prisma');
const generateNumberRandom = require("../../utils/generateNumberRandom");

module.exports = async function validateForgotPassword(request, response) {
    try {
        const dataValidateForgotPassword = request.body
        validateFields(['email'], dataValidateForgotPassword)
        const codEmailValidate = generateNumberRandom()
        console.log(dataValidateForgotPassword.email)
        const storeInfo = await prisma.user.findUnique({
            where: { email: dataValidateForgotPassword.email }
        })
        if (!storeInfo) {
            throw new Error('Não encontrado usuário com o e-mail informado.')
        }
        sendEmailChangePass(storeInfo.email, codEmailValidate, storeInfo.name)
        await prisma.user.update({
            where: { id: storeInfo.id },
            data: { codEmailPass: codEmailValidate }
        })
        return response.json({ Success: true, codEmailValidate })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}