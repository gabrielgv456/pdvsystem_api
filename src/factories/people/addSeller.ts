import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function AddSeller(request: Request, response: Response) {

    try {

        const { dataAddSeller } = request.body
        if (!dataAddSeller){throw new Error('Não localizado a propriedade "dataAddSeller" ')}

        const addSeller = await prisma.sellers.create({
            data: {
                email: dataAddSeller.email,
                adressCep: dataAddSeller.adressCep,
                adressCity: dataAddSeller.adressCity,
                active: dataAddSeller.active,
                adressComplement: dataAddSeller.adressComplement,
                adressNeighborhood: dataAddSeller.adressNeighborhood,
                adressNumber: dataAddSeller.adressNumber,
                adressState: dataAddSeller.adressState,
                adressStreet: dataAddSeller.adressStreet,
                birthDate: dataAddSeller.birthDate,
                cellNumber: dataAddSeller.cellNumber,
                cpf: dataAddSeller.cpf,
                gender: dataAddSeller.gender,
                name: dataAddSeller.name,
                phoneNumber: dataAddSeller.phoneNumber,
                storeId: dataAddSeller.storeId,
            }
        })
        return response.json({ Success: true, dataSeller: addSeller })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }

}