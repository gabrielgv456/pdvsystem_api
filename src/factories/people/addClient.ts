import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function addClient(request: Request, response: Response) {

    try {
        const { email,
            active,
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
            finalCostumer,
            address }: requestAddEditClientType = request.body

        const existsClient = await prisma.clients.findMany({
            where: {
                AND: [{ cpf }, { storeId }]
            }, select: {
                id: true
            }
        })
        if (existsClient.length > 0) throw new Error('Já existe cliente com o documento ' + cpf)

        await prisma.$transaction(async (prismaTx) => {
            let addressId: number | null = null;
            if (address.addressStreet && address.addressNeighborhood) {
                const addAddress = await prismaTx.address.create({
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
                addressId = addAddress.id
            }
            const addClient = await prismaTx.clients.create({
                data: {
                    email,
                    addressId: addressId,
                    active,
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

            return response.json({ Success: true, dataClient: addClient })
        })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}

export type requestAddEditClientType = {
    id: number | null;
    created_at: Date | null;
    name: string;
    gender: string | null;
    cpf: string;
    email: string | null;
    ie: string | null;
    suframa: string | null;
    finalCostumer: boolean | null;
    birthDate: Date | null;
    phoneNumber: string | null;
    cellNumber: string | null;
    addressId: number | null;
    active: boolean;
    storeId: number;
    taxPayerTypeId: number | null;
    taxRegimeId: number | null;
    address: AddressType | null;
}

export type AddressType = {
    id?: number;
    storeId?: number;
    addressTypeId: number;
    addressStreet: string;
    addressNumber: string;
    addressNeighborhood: string;
    addressComplement: string;
    addressCep: string;
    cityId: number;
    created_at?: string;
    city?: CityStateType;
};

interface State {
    id: number;
    name: string;
    uf: string;
    ibge: number;
}

export interface CityStateType {
    id: number;
    name: string;
    ibge: number;
    stateId: number;
    latLon: string | null;
    cod_tom: number | null;
    state: State;
}
