import { Address } from '@prisma/client'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'
import validateFields from '../../utils/validateFields'

export default async function changeAboutCorporation(request: Request, response: Response) {
    try {
        const requiredFields: Array<keyof editUserTypeReq> = [
            "storeId",
            "name",
            "cnpj",
            "phone",
            "cellPhone",
            "addressId",
            "addressCep",
            "addressStreet",
            "addressNumber",
            "addressNeighborhood",
            "addressCityId",
            "fantasyName",
            "ie",
            "email"
        ]
        const req: editUserTypeReq = request.body.data
        validateFields(requiredFields, req)

        await prisma.$transaction(async (prismaTx) => {

            const existsAddress = req.addressStreet && req.addressNeighborhood
            let postAddress: Address | null = null
            if (existsAddress) {
                if (!req.addressId) {
                    postAddress = await prismaTx.address.create({
                        data: {
                            addressCep: req.addressCep,
                            cityId: req.addressCityId,
                            addressComplement: null,
                            addressNeighborhood: req.addressNeighborhood,
                            addressStreet: req.addressStreet,
                            addressNumber: req.addressNumber,
                            addressTypeId: 2,
                            storeId: req.storeId
                        }
                    })
                } else {
                    postAddress = await prismaTx.address.update({
                        data: {
                            addressCep: req.addressCep,
                            cityId: req.addressCityId,
                            addressComplement: null,
                            addressNeighborhood: req.addressNeighborhood,
                            addressStreet: req.addressStreet,
                            addressNumber: req.addressNumber,
                            addressTypeId: 2
                        },
                        where: { id_storeId: { id: req.addressId, storeId: req.storeId } }
                    })
                }
            }

            const updateAbouteCorporation = await prisma.user.update({
                where: {
                    id: req.storeId
                }, data: {
                    cellPhone: req.cellPhone,
                    cnpj: req.cnpj,
                    //email,
                    fantasyName: req.fantasyName,
                    name: req.name,
                    phone: req.phone,
                    ie: req.ie,
                    addressId: postAddress.id
                }, select: {
                    address: { include: { city: { include: { state: true } } } }, cellPhone: true, cnpj: true, email: true, name: true,
                    phone: true, urlLogo: true, ie: true
                }
            })

            return response.json({ Success: true, updateAbouteCorporation })
        })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}

type editUserTypeReq = {
    storeId: number;
    name: string | null;
    cnpj: string | null;
    phone: string | null;
    cellPhone: string | null;
    addressId: number | null;
    addressCep: string | null;
    addressStreet: string | null;
    addressNumber: string | null;
    addressNeighborhood: string | null;
    addressCityId: number | null;
    fantasyName: string | null;
    ie: string | null;
    email: string
};

