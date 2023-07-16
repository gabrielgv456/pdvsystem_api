const prisma = require('../../services/prisma')

module.exports = async function deleteSeller(request, response) {
    const { dataDeleteSeller } = request.body

    try {
        const deleteSellerDb = await prisma.sellers.deleteMany({
            where: {
                AND: [
                    { id: dataDeleteSeller.sellerId },
                    { storeId: dataDeleteSeller.userId }
                ]
            }
        })
        if (deleteSellerDb.count > 0) {
            return response.json({ Success: true })
        }
        else if (deleteSellerDb.count <= 0) {
            return response.sjon({ Success: false, erro: 'Nenhum registro encontrado com os parametros fonecidos' })
        }
    }
    catch (error) {

        return response.status(400).json({ Success: false, erro: error.message })

    }
}