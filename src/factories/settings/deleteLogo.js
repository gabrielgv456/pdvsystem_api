const prisma = require("../../services/prisma")
const validateFields = require("../../utils/validateFields")

module.exports = async function deleteLogo(request, response) {
    try {
        validateFields(['storeId'],request.query)
        await prisma.user.update({
            where: {
                id: parseInt(request.query.storeId)
            },
            data: {
                urlLogo: null
            }
        })
        response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}