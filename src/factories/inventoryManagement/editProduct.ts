// @ts-check

import validateFields from '../../utils/validateFields';
import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'
import { sharedAddEditProductRequest } from '../../shared-types/src/types/api/inventoryManagement/productsRequest';
import { validateRulesAddEditProduct } from './addProduct';
import { Prisma, TaxGroup } from '@prisma/client';

export default async function editProduct(request: Request, response: Response) {

    try {
        const data: sharedAddEditProductRequest = request.body
        const requiredFields = ['userId', 'id', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'unitMeasurement']
        validateFields(requiredFields, data.principal)
        validateRulesAddEditProduct(data)

        await prisma.$transaction(async (prismaTx) => {

            if (!data.principal.id) { throw new Error('Id do produto não informado!') }

            const searchProduct = await prismaTx.products.findUnique({
                where: {
                    id_storeId: { id: data.principal.id, storeId: data.principal.userId }
                }, include: {
                    taxGroup: true
                }
            })
            if (!searchProduct) {
                throw new Error(`Não foi encontrado o produto informado ${data.principal.codRef}`)
            }
            if (data.principal.codRef) {
                const verifyCodRefExists = await prismaTx.products.findMany({
                    where: {
                        AND: [{
                            codRef: data.principal.codRef
                        }, {
                            storeId: data.principal.userId
                        }

                        ], NOT: {
                            id: searchProduct.id
                        }
                    }
                })
                if (verifyCodRefExists.length > 0) {
                    throw new Error(`Já existe produto cadastrado com o código de referência ${data.principal.codRef}`)
                }
            }

            // Tributacao

            if (searchProduct.taxGroupId)
                await updateFiscalTaxes(prismaTx, searchProduct.taxGroup, data)
            else
                await createFiscalTaxes(prismaTx, data)


            const editProduct = await prismaTx.products.update({
                data: {
                    name: data.principal.name,
                    codRef: data.principal.codRef,
                    exTipi: data.principal.exTipi,
                    brand: data.principal.brand,
                    value: data.principal.value,
                    quantity: data.principal.quantity,
                    active: data.principal.active,
                    cost: data.principal.cost,
                    profitMargin: data.principal.profitMargin,
                    barCode: data.principal.barCode,
                    ncmCode: data.principal.ncmCode,
                    unitMeasurement: data.principal.unitMeasurement,
                    itemTypeId: data.principal.itemTypeId,
                    imageId: data.principal.imageId,
                }, where: {
                    id_storeId: {
                        id: data.principal.id,
                        storeId: data.principal.userId
                    }
                }
            })

            if (searchProduct.quantity > data.principal.quantity) {
                await prismaTx.transactionsProducts.create({
                    data: {
                        type: "S",
                        description: "Ajuste de estoque",
                        totalQuantity: data.principal.quantity,
                        quantity: searchProduct.quantity - data.principal.quantity,
                        productId: data.principal.id,
                        storeId: data.principal.userId
                    }
                })

            }
            if (searchProduct.quantity < data.principal.quantity) {
                await prismaTx.transactionsProducts.create({
                    data: {
                        type: "E",
                        description: "Ajuste de estoque",
                        totalQuantity: data.principal.quantity,
                        quantity: data.principal.quantity - searchProduct.quantity,
                        productId: data.principal.id,
                        storeId: data.principal.userId
                    }
                })
            }

            return response.json({ Success: true })
        })
    }
    catch (error) {
        return response.status(400).json({ erro: (error as Error).message })
    }

}

async function createFiscalTaxes(prismaTx: Prisma.TransactionClient, data: sharedAddEditProductRequest) {


    const createdTaxIcmsNfe = await prismaTx.taxIcmsNfe.create({
        data: {
            taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
            taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
            taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
            taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
            taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
            taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
            taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
        }
    })

    const createdTaxIcmsNoPayer = await prismaTx.taxIcmsNoPayer.create({

        data: {
            taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
            taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
            taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId,
        }
    })

    const createdTaxIcmsNfce = await prismaTx.taxIcmsNfce.create({
        data: {
            taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
            taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
            taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
            taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
            taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId,
        }
    })

    const createdTaxIcmsST = await prismaTx.taxIcmsST.create({
        data: {
            taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
            taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
            taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
            taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
            taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
            taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
            taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
            taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta,
        }
    })

    const icmsCreated = await prismaTx.taxIcms.create({
        data: {
            fcpAliquot: data.icms.TaxIcms.fcpAliquot,
            taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId,
            taxIcmsNfceId: createdTaxIcmsNfce.id,
            taxIcmsNfeId: createdTaxIcmsNfe.id,
            taxIcmsNoPayerId: createdTaxIcmsNoPayer.id,
            taxIcmsStId: createdTaxIcmsST.id
        }
    })

    const cofinsCreated = await prismaTx.taxCofins.create({
        data: {
            taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
            taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
            taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
            taxCstCofinsExitId: data.cofins.taxCstCofinsExitId,
        }
    })

    const ipiCreated = await prismaTx.taxIpi.create({
        data: {
            taxAliquotIpi: data.ipi.taxAliquotIpi,
            taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
            taxCnpjProd: data.ipi.taxCnpjProd,
            taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
            taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
            taxCstIpiExitId: data.ipi.taxCstIpiExitId,
            taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
            taxStampIpi: data.ipi.taxStampIpi
        }
    })

    const pisCreated = await prismaTx.taxPis.create({
        data: {
            taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
            taxAliquotPisExit: data.pis.taxAliquotPisExit,
            taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
            taxCstPisExitId: data.pis.taxCstPisExitId
        }
    })

    // Cria Grupo de Tributação

    const taxGroupCreated = await prismaTx.taxGroup.create({
        data: {
            individual: true,
            taxCofinsId: cofinsCreated.id,
            taxIcmsId: icmsCreated.id,
            taxIpiId: ipiCreated.id,
            taxPisId: pisCreated.id,
            description: 'Grupo de produto individual',
            storeId: data.principal.userId
        }
    })

    await prismaTx.products.update({
        data: {
            taxGroupId: taxGroupCreated.id
        }, where: {
            id_storeId: {
                id: data.principal.id,
                storeId: data.principal.userId
            }
        }
    })

}


async function updateFiscalTaxes(prismaTx: Prisma.TransactionClient, groupTax: TaxGroup, data: sharedAddEditProductRequest) {

    if (groupTax.taxIcmsId) {
        const icmsEdited = await prismaTx.taxIcms.update({
            where: {
                id: groupTax.taxIcmsId
            },
            data: {
                fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId
            }
        })


        await prismaTx.taxIcmsNfe.update({
            where: {
                id: icmsEdited.taxIcmsNfeId,
            },
            data: {
                taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
                taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
                taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
                taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
                taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
                taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
                taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
            }
        })

        await prismaTx.taxIcmsNoPayer.update({
            where: {
                id: icmsEdited.taxIcmsNoPayerId
            },
            data: {
                taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
            }
        })

        await prismaTx.taxIcmsNfce.update({
            where: {
                id: icmsEdited.taxIcmsNfceId,
            },
            data: {
                taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
            },
        })

        await prismaTx.taxIcmsST.update({
            where: {
                id: icmsEdited.taxIcmsStId
            },
            data: {
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
    }
    if (groupTax.taxCofinsId) {
        await prismaTx.taxCofins.update({
            where: {
                id: groupTax.taxCofinsId
            },
            data: {
                taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
            }
        })
    }
    if (groupTax.taxIpiId) {
        await prismaTx.taxIpi.update({
            where: {
                id: groupTax.taxIpiId
            },
            data: {
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
    }
    if (groupTax.taxPisId) {
        await prismaTx.taxPis.update({
            where: {
                id: groupTax.taxPisId
            },
            data: {
                taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                taxAliquotPisExit: data.pis.taxAliquotPisExit,
                taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                taxCstPisExitId: data.pis.taxCstPisExitId,
            }
        })
    }

}