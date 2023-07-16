const prisma = require('../../services/prisma')

module.exports = async function findCfop(request, response) {
    try {
        const findCfop = await prisma.Cfop.findMany()
        if (findCfop) {
            return response.json({ Success: true, findCfop })
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}