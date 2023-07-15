module.exports = (prisma) => async function changeAboutCorporation(request, response) {
    
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