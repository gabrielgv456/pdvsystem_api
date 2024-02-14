// @ts-check
import prisma from '../../services/prisma/index.js';
import validateFields from '../../utils/validateFields.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function editAddressDeliveries(request, response) {
    try {
        const { dataChangeAddressDelivery } = request.body
        const requiredFields = ['storeId', 'deliveryId', 'addressId', 'scheduledDate', 'addressComplement', 'addressCep',
            'addressStreet', 'addressNumber', 'addressNeighborhood', 'addressCity', 'addressState']
        validateFields(requiredFields, dataChangeAddressDelivery)
        await prisma.$transaction(async (prismaTx) => {

            await prismaTx.address.updateMany({
                where: {
                    storeId: dataChangeAddressDelivery.storeId,
                    id: dataChangeAddressDelivery.addressId
                },
                data: {
                    addressCep : dataChangeAddressDelivery.addressCep,
                    addressCity : dataChangeAddressDelivery.addressCity,
                    addressComplement: dataChangeAddressDelivery.addressComplement,
                    addressNeighborhood: dataChangeAddressDelivery.addressNeighborhood,
                    addressNumber: dataChangeAddressDelivery.addressNumber,
                    addressState: dataChangeAddressDelivery.addressState,
                    addressStreet: dataChangeAddressDelivery.addressStreet
                }
            })

            await prismaTx.deliveries.updateMany({
                where: {
                    storeId: dataChangeAddressDelivery.storeId,
                    addressId: dataChangeAddressDelivery.addressId
                },
                data: {
                    scheduledDate: dataChangeAddressDelivery.scheduledDate
                }
            })

            return response.json({ Success: true })
        })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }
}