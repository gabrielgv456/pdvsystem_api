// @ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function EditSeller(request, response) {

    const { dataEditSeller } = request.body

    if (dataEditSeller) {
        try {
            const editSeller = await prisma.sellers.update({
                where: {
                    id_storeId: {
                        id: dataEditSeller.idSeller,
                        storeId: dataEditSeller.storeId
                    }
                },
                data: {
                    email: dataEditSeller.email,
                    adressCep: dataEditSeller.adressCep,
                    adressCity: dataEditSeller.adressCity,
                    adressComplement: dataEditSeller.adressComplement,
                    adressNeighborhood: dataEditSeller.adressNeighborhood,
                    adressNumber: dataEditSeller.adressNumber,
                    adressState: dataEditSeller.adressState,
                    adressStreet: dataEditSeller.adressStreet,
                    birthDate: dataEditSeller.birthDate,
                    cellNumber: dataEditSeller.cellNumber,
                    cpf: dataEditSeller.cpf,
                    gender: dataEditSeller.gender,
                    name: dataEditSeller.name,
                    phoneNumber: dataEditSeller.phoneNumber,
                    active: dataEditSeller.active
                }
            })
            if (editSeller) {
                return response.json({ Success: true, dataSeller: editSeller })
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