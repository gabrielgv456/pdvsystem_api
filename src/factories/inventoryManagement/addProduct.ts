import validateFields from '../../utils/validateFields';
import prisma from '../../services/prisma/index';
import { sharedAddEditProductRequest } from '../../shared-types/src/types/api/inventoryManagement/productsRequest';
import { Request, Response } from 'express'


export default async function addProduct(request: Request, response: Response) {

    try {
        const data: sharedAddEditProductRequest = request.body
        const requiredFields = ['userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'unitMeasurement']
        validateFields(requiredFields, data.principal)
        validateRulesAddEditProduct(data)

        await prisma.$transaction(async (prismaTx) => {
            if (data.principal.codRef) {
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
            }

            // taxes start


            // ICMS

            const taxIcmsNfeCreated = await prismaTx.taxIcmsNfe.create({
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

            const taxIcmsNoPayerCreated = await prismaTx.taxIcmsNoPayer.create({
                data: {
                    taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                    taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                    taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
                }
            })

            const taxIcmsNfceCreated = await prismaTx.taxIcmsNfce.create({
                data: {
                    taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                    taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                    taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                    taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                    taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
                }
            })

            const taxIcmsSTCreated = await prismaTx.taxIcmsST.create({
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

            const icmsCreated = await prismaTx.taxIcms.create({
                data: {
                    fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                    taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId,
                    taxIcmsNfceId: taxIcmsNfceCreated.id,
                    taxIcmsNfeId: taxIcmsNfeCreated.id,
                    taxIcmsNoPayerId: taxIcmsNoPayerCreated.id,
                    taxIcmsStId: taxIcmsSTCreated.id
                }
            })

            // COFINS
            const cofinsCreated = await prismaTx.taxCofins.create({
                data: {
                    taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                    taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                    taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                    taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
                }
            })

            // IPI
            const ipiCreated = await prismaTx.taxIpi.create({
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

            //PIS
            const pisCreated = await prismaTx.taxPis.create({
                data: {
                    taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                    taxAliquotPisExit: data.pis.taxAliquotPisExit,
                    taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                    taxCstPisExitId: data.pis.taxCstPisExitId,
                }
            })

            // Cria Grupo de Tributação

            const taxGroup = await prismaTx.taxGroup.create({
                data: {
                    individual: true,
                    description: 'Grupo de produto individual',
                    taxCofinsId: cofinsCreated.id,
                    taxIcmsId: icmsCreated.id,
                    taxIpiId: ipiCreated.id,
                    taxPisId: pisCreated.id,
                    storeId: data.principal.userId
                }
            })

            // Adiciona Produtos
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
                    taxGroupId: taxGroup.id
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
        return response.status(400).json({ erro: (error as Error).message })
    }

}


export const validateRulesAddEditProduct = (data: sharedAddEditProductRequest) => {

    function ICMSValidate(CST: number, aliquota: number) {
        switch (CST) {
            case 40: // 40 - Isenta   
            case 41: // 41 - Não tributada
            case 50: // 50 - Suspensão
            case 60: // 60 - ICMS cobrado anteriormente por substituição tributária
            case 102: // 102 - Simples Nacional - Tributada pelo Simples Nacional sem permissão de crédito
            case 103: // 103 - Simples Nacional - Isenção do ICMS no Simples Nacional para faixa de receita bruta
            case 300: // 300 - Simples Nacional - Imune
            case 400: // 400 - Simples Nacional - Não tributada pelo Simples Nacional
            case 500: // 500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação 500 - Simples Nacional - ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação
                {
                    if (aliquota > 0) {
                        throw new Error(`Para CST ICMS ${CST} a alíquota deve estar zerada!`)
                    }
                    break;
                }
        }
    }

    ICMSValidate(data.icms.TaxIcmsNfe.taxCstIcmsId, data.icms.TaxIcmsNfe.taxAliquotIcms)
    ICMSValidate(data.icms.TaxIcmsNoPayer.taxCstIcmsId, data.icms.TaxIcmsNoPayer.taxAliquotIcms)
    ICMSValidate(data.icms.TaxIcmsNfce.taxCstIcmsId, data.icms.TaxIcmsNfce.taxAliquotIcms)

    // COFINS

    switch (data.cofins.taxCstCofinsExitId) {
        case 4: // 04 - Operação Tributável Monofásica - Revenda a Alíquota Zero
        case 5: // 05 - Operação Tributável por Substituição Tributária
        case 6: // 06 - Operação Tributável a Alíquota Zero 
        case 7: // 07 - Operação Isenta da Contribuição
        case 8: // 08 - Operação sem Incidência da Contribuição  
        case 9: // 09 - Operação com Suspensão da Contribuição
            {
                if (data.cofins.taxAliquotCofinsExit > 0) {
                    throw new Error(`Para CST COFINS ${data.cofins.taxCstCofinsExitId} a alíquota deve estar zerada!`)
                }
                break;
            }
    }

    // IPI 

    switch (data.ipi.taxCstIpiExitId) {
        case 51: // 51 - Saída Tributável com Alíquota Zero   
        case 52: // 52 - Saída Isenta
        case 53: // 53 - Saída Não-Tributada 
        case 54: // 54 - Saída Imune
        case 55: // 55 - Saída com Suspensão
            {
                if (data.ipi.taxAliquotIpi > 0) {
                    throw new Error(`Para CST IPI ${data.ipi.taxCstIpiExitId} a alíquota deve estar zerada!`)
                }
                break;
            }
    }

    // PIS

    switch (data.pis.taxCstPisExitId) {
        case 4: // 04 - Operação Tributável Monofásica - Revenda a Alíquota Zero
        case 5: // 05 - Operação Tributável por Substituição Tributária
        case 6: // 06 - Operação Tributável a Alíquota Zero
        case 7: // 07 - Operação Isenta da Contribuição
        case 8: // 08 - Operação sem Incidência da Contribuição
        case 9: // 09 - Operação com Suspensão da Contribuição
            {
                if (data.pis.taxAliquotPisExit > 0) {
                    throw new Error(`Para CST IPI ${data.pis.taxCstPisExitId} a alíquota deve estar zerada!`)
                }
                break;
            }
    }

}