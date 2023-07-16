const prisma = require('../../services/prisma')

module.exports = async function findClients(request, response) {
    
    const { userId } = request.body

    if (userId) {
        try {
            const findClients = await prisma.clients.findMany({
                orderBy: {
                    name: 'asc'
                },
                where: {
                    storeId: userId
                }
            })
            // if (findClients.length === 0) {
            //     return response.json({ Success: false, erro: "ERRO: Nenhum cliente encontrado com os dados fornecidos!" })
            // }
            // else {
            return response.json({ Success: true, findClients })
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