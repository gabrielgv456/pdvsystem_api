// @ts-check

import validateFields from '../../utils/validateFields.js';
import prisma from '../../services/prisma/index.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function addProduct(request, response) {

    try {
        const data = request.body
        const requiredFields = ['userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement']
        validateFields(requiredFields, data.principal)
        
        await prisma.$transaction(async (prismaTx) => {
            const verifyCodRefExists = await prismaTx.products.findMany({
                where: {
                    AND: [{
                        codRef: data.principal.codRef
                    }, {
                        storeId: data.principal.userId
                    }]
                }
            })
            if (verifyCodRefExists.length > 0) {
                throw new Error(`Já existe produto cadastrado com o código de referência ${data.principal.codRef}`)
            }

            const addproduct = await prismaTx.products.create({
                data: {
                    name: data.principal.name,
                    codRef: data.principal.codRef,
                    exTipi: data.principal.exTipi,
                    brand: data.principal.brand,
                    value: data.principal.value,
                    storeId: data.principal.userId,
                    quantity: data.principal.quantity,
                    active: data.principal.active,
                    cost: data.principal.cost,
                    profitMargin: data.principal.profitMargin,
                    barCode: data.principal.barCode,
                    ncmCode: data.principal.ncmCode,
                    unitMeasurement: data.principal.unitMeasurement,
                    itemTypeId: data.principal.itemTypeId,
                    imageId: data.principal.imageId,
                }
            })

            // taxes start

            const icmsCreated = await prismaTx.taxIcms.create({
                data: {
                    productId: addproduct.id,
                    fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                    taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId
                }
            })

            await prismaTx.taxIcmsNfe.create({
                data: {
                    taxIcmsId: icmsCreated.id,
                    taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
                    taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
                    taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
                    taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
                    taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
                    taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
                    taxReasonExemption: data.icms.TaxIcmsNfe.taxReasonExemption,
                    taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
                }
            })

            await prismaTx.taxIcmsNoPayer.create({
                data: {
                    taxIcmsId: icmsCreated.id,
                    taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                    taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                    taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
                }
            })

            await prismaTx.taxIcmsNfce.create({
                data: {
                    taxIcmsId: icmsCreated.id,
                    taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                    taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                    taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                    taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                    taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
                }
            })

            await prismaTx.taxIcmsST.create({
                data: {
                    taxIcmsId: icmsCreated.id,
                    taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
                    taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
                    taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
                    taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
                    taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
                    taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
                    taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
                    taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta
                }
            })

            await prismaTx.taxCofins.create({
                data: {
                    productId: addproduct.id,
                    taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                    taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                    taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                    taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
                }
            })

            await prismaTx.taxIpi.create({
                data: {
                    productId: addproduct.id,
                    taxAliquotIpi: data.ipi.taxAliquotIpi,
                    taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
                    taxCnpjProd: data.ipi.taxCnpjProd,
                    taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
                    taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
                    taxCstIpiExitId: data.ipi.taxCstIpiExitId,
                    taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
                    taxStampIpi: data.ipi.taxStampIpi,
                }
            })

            await prismaTx.taxPis.create({
                data: {
                    productId: addproduct.id,
                    taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                    taxAliquotPisExit: data.pis.taxAliquotPisExit,
                    taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                    taxCstPisExitId: data.pis.taxCstPisExitId,
                }
            })

            await prismaTx.transactionsProducts.create({
                data: {
                    type: "E",
                    description: "Criação do produto",
                    totalQuantity: data.principal.quantity,
                    quantity: data.principal.quantity,
                    productId: addproduct.id,
                    storeId: data.principal.userId
                }
            })
            return response.json({ Success: true })
        })
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}