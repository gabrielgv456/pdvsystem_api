import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function changeAboutCorporation(request: Request, response: Response) {
    try {
        const requiredFields = [
            "storeId",
            "name",
            "phone",
            "adressCep",
            "adressNeighborhood",
            "adressNumber",
            "adressState",
            "fantasyName",
            "adressStreet",
            "adressCity",
            "cellPhone",
            "cnpj",
            "ie"
        ]
        const { storeId, name, phone, adressCep, adressNeighborhood, adressNumber, adressState, fantasyName, adressStreet, adressCity, cellPhone, cnpj, ie } = request.body.data

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
                phone,
                ie
            }, select: {
                adressCep: true, adressCity: true, adressNeighborhood: true, adressNumber: true,
                adressState: true, adressStreet: true, cellPhone: true, cnpj: true, email: true, name: true,
                phone: true, urlLogo: true, ie: true
            }
        })
        if (!updateAbouteCorporation) {
            throw new Error('Falha ao atualizar dados sobre a empresa!')
        }
        return response.json({ Success: true, updateAbouteCorporation })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}