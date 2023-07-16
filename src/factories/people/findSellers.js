const prisma = require('../../services/prisma')

module.exports = async function findSellers(request, response) {
    const { userId } = request.body

    if (userId) {
        try {
            const findSellers = await prisma.sellers.findMany({
                orderBy: { name: 'asc' },
                where: {
                    storeId: userId
                }
            })
            // if (findSellers.length === 0) {
            //     return response.json({ Success: false, erro: "ERRO: Nenhum vendedor encontrado com os dados fornecidos!" })
            // }
            // else {
            return response.json({ Success: true, findSellers })
            // }
        }
        catch (error) {
            return response.status(400).json({ Sucess: false, erro: error.message })
        }
    }
    else {
        return response.status(400).json({ Sucess: false, erro: "Dados invalidos, informe corretamente !" })
    }
}