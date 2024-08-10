import prisma from '../../services/prisma/index';
import validateFields from '../../utils/validateFields';
import { Request, Response } from 'express'

export default async function editAddressDeliveries(request: Request, response: Response) {
    try {
        const { dataChangeAddressDelivery }: typeRequestDeliveryAdressChange = request.body
        const requiredFields : Array<keyof content> = ['storeId', 'deliveryId', 'addressId', 'scheduledDate', 'addressComplement', 'addressCep',
            'addressStreet', 'addressNumber', 'addressNeighborhood']
        validateFields(requiredFields, dataChangeAddressDelivery)
        await prisma.$transaction(async (prismaTx) => {

            await prismaTx.address.update({
                where: {
                    id_storeId: {
                        storeId: dataChangeAddressDelivery.storeId,
                        id: dataChangeAddressDelivery.addressId
                    }
                },
                data: {
                    addressCep: dataChangeAddressDelivery.addressCep,
                    cityId: dataChangeAddressDelivery.cityId,
                    addressComplement: dataChangeAddressDelivery.addressComplement,
                    addressNeighborhood: dataChangeAddressDelivery.addressNeighborhood,
                    addressNumber: dataChangeAddressDelivery.addressNumber,
                    addressStreet: dataChangeAddressDelivery.addressStreet
                }
            })

            await prismaTx.deliveries.update({
                where: {
                    id_storeId: {
                        id: dataChangeAddressDelivery.deliveryId,
                        storeId: dataChangeAddressDelivery.storeId,
                    }
                },
                data: {
                    scheduledDate: dataChangeAddressDelivery.scheduledDate
                }
            })

            return response.json({ Success: true })
        })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }
}

type typeRequestDeliveryAdressChange = {
    dataChangeAddressDelivery: content
}

type content = {
    scheduledDate: string | null;
    addressId: number;
    deliveryId: number;
    storeId: number;
    id: number;
} & AddressType

type AddressType = {
    id: number;
    storeId: number;
    addressTypeId: number;
    addressStreet: string;
    addressNumber: string | null;
    addressNeighborhood: string;
    addressComplement: string | null;
    addressCep: string | null;
    cityId: number | null;
    created_at: string;
    city?: CityStateType | null;
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


