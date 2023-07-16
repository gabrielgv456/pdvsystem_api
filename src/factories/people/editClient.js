const prisma = require('../../services/prisma')

module.exports = async function editClient(request, response) {

    const { dataEditClient } = request.body

    if (dataEditClient) {
        try {
            const editClient = await prisma.clients.updateMany({
                where: {
                    AND:
                        [
                            { id: dataEditClient.idClient },
                            { storeId: dataEditClient.storeId }
                        ]
                },
                data: {
                    email: dataEditClient.email,
                    adressCep: dataEditClient.adressCep,
                    adressCity: dataEditClient.adressCity,
                    adressComplement: dataEditClient.adressComplement,
                    adressNeighborhood: dataEditClient.adressNeighborhood,
                    adressNumber: dataEditClient.adressNumber,
                    adressState: dataEditClient.adressState,
                    adressStreet: dataEditClient.adressStreet,
                    birthDate: dataEditClient.birthDate,
                    cellNumber: dataEditClient.cellNumber,
                    cpf: dataEditClient.cpf,
                    gender: dataEditClient.gender,
                    name: dataEditClient.name,
                    phoneNumber: dataEditClient.phoneNumber,

                }
            })
            if (editClient) {
                return response.json({ Success: true, dataClient: editClient })
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