const prisma = require('../../services/prisma')

module.exports = async function changeAboutCorporation(request, response) {
    try {
        const { storeId, name, phone, adressCep, adressNeighborhood, adressNumber, adressState, fantasyName, adressStreet, adressCity, cellPhone, cnpj } = request.body.data

        const updateAbouteCorporation = await prisma.user.update({
            where: {
                id: storeId
            }, data: {
                adressCep,
                adressNeighborhood,
                adressNumber,
                adressState,
                adressStreet,
                adressCity,
                cellPhone,
                cnpj,
                //email,
                fantasyName,
                name,
                phone
            }, select: {
                adressCep: true, adressCity: true, adressNeighborhood: true, adressNumber: true,
                adressState: true, adressStreet: true, cellPhone: true, cnpj: true, email: true, name: true,
                phone: true, urlLogo: true
            }
        })
        if (!updateAbouteCorporation) {
            throw new Error('Falha ao atualizar dados sobre a empresa!')
        }
        return response.json({ Success: true, updateAbouteCorporation })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}