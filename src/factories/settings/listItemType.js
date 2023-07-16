const prisma = require('../../services/prisma')

module.exports = async function listItemType(request, response) {
    try {
        const findItemType = await prisma.itemType.findMany()
        if (findItemType) {
            return response.json({ Success: true, findItemType })
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}
