const prisma = require('../../services/prisma')

module.exports = async function addClient(request, response) {

    const { dataAddClient } = request.body

    if (dataAddClient) {
        try {
            const addClient = await prisma.clients.create({
                data: {
                    email: dataAddClient.email,
                    adressCep: dataAddClient.adressCep,
                    adressCity: dataAddClient.adressCity,
                    active: dataAddClient.active,
                    adressComplement: dataAddClient.adressComplement,
                    adressNeighborhood: dataAddClient.adressNeighborhood,
                    adressNumber: dataAddClient.adressNumber,
                    adressState: dataAddClient.adressState,
                    adressStreet: dataAddClient.adressStreet,
                    birthDate: dataAddClient.birthDate,
                    cellNumber: dataAddClient.cellNumber,
                    cpf: dataAddClient.cpf,
                    gender: dataAddClient.gender,
                    name: dataAddClient.name,
                    phoneNumber: dataAddClient.phoneNumber,
                    storeId: dataAddClient.storeId,
                }
            })
            if (addClient) {
                return response.json({ Success: true, dataClient: addClient })
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message })
        }
    }
    else {
        return response.status(400).json({ Success: false, erro: "Dados invalidos, informe corretamente !" })
    }
}