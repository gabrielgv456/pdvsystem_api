const prisma = require('../../services/prisma')

module.exports = async function validateMail(request, response) {
    const { userId } = request.body
    try {
        const validateMail = await prisma.user.update({
            where: {
                id: userId
            }, data: {
                codEmailValidate: null,
                isEmailValid: true
            }
        })
        if (validateMail) {
            return response.json({ Success: true })

        } else {
            throw new Error('Falha ao validar e-mail')
        }

    } catch (error) {
        return response.status(400).json({ success: false, erro: error.message })
    }
}