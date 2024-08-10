import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'
import { requestAddEditClientType } from './addClient';
import { Address } from '@prisma/client';


export default async function editClient(request: Request, response: Response) {

    try {

        validateFields(requiredFields, request.body)

        const { id,
            email,
            active,
            address,
            birthDate,
            cellNumber,
            cpf,
            gender,
            name,
            phoneNumber,
            storeId,
            ie,
            suframa,
            taxPayerTypeId,
            taxRegimeId,
            finalCostumer }: requestAddEditClientType = request.body

        if (!id) { throw new Error('Informe o valor do id cliente!') }
        if (!storeId) { throw new Error('Informe o valor do storeId!') }

        const existsClient = await prisma.clients.findMany({
            where: {
                AND: [{ cpf }, { storeId }],
                NOT: [{ id: id }]
            }, select: { id: true }
        })
        if (existsClient.length > 0) throw new Error('Já existe cliente com o documento ' + cpf)

        await prisma.$transaction(async (prismaTx) => {
            const existsAddress = address.addressStreet && address.addressNeighborhood
            let postAddress: Address | null = null
            if (existsAddress) {
                const getAddress = await prisma.address.findUnique({ where: { id_storeId: { id, storeId } } })
                if (!getAddress) {
                    postAddress = await prismaTx.address.create({
                        data: {
                            addressCep: address.addressCep,
                            cityId: address.cityId,
                            addressComplement: address.addressComplement,
                            addressNeighborhood: address.addressNeighborhood,
                            addressStreet: address.addressStreet,
                            addressNumber: address.addressNumber,
                            addressTypeId: address.addressTypeId,
                            storeId: storeId
                        }
                    })
                } else {
                    postAddress = await prismaTx.address.update({
                        data: {
                            addressCep: address.addressCep,
                            cityId: address.cityId,
                            addressComplement: address.addressComplement,
                            addressNeighborhood: address.addressNeighborhood,
                            addressStreet: address.addressStreet,
                            addressNumber: address.addressNumber,
                            addressTypeId: address.addressTypeId
                        },
                        where: { id_storeId: { id: getAddress.id, storeId } }
                    })
                }
            }


            const editClient = await prismaTx.clients.update({
                where: {
                    id_storeId: {
                        id: id,
                        storeId
                    }
                },
                data: {
                    email,
                    active,
                    addressId: postAddress?.id ?? null,
                    birthDate,
                    cellNumber,
                    cpf,
                    gender,
                    name,
                    phoneNumber,
                    storeId,
                    ie,
                    suframa,
                    taxPayerTypeId,
                    taxRegimeId,
                    finalCostumer
                }
            })

            return response.json({ Success: true, dataClient: editClient })
        })

    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}

const requiredFields: Array<keyof requestAddEditClientType> = [
    "id",
    "email",
    "active",
    "address",
    "birthDate",
    "cellNumber",
    "cpf",
    "gender",
    "name",
    "phoneNumber",
    "storeId",
    "ie",
    "suframa",
    "taxPayerTypeId",
    "taxRegimeId",
    "finalCostumer"
];
