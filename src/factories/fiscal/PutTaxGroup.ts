import { Prisma } from "@prisma/client"
import { sharedTaxGroupReqType, sharedTaxGroupResType } from "@shared/api/fiscal/CreatePutTaxGroup"
import { Request, Response } from "express"
import prisma from "../../services/prisma"
import { validateRulesAddEditProduct } from "../inventoryManagement/addProduct"

export const PutTaxGroup = async (request: Request, response: Response) => {
    try {
        await prisma.$transaction(async (prismaTx) => {
            const data: sharedTaxGroupReqType = request.body
            reqValidations(data)
            await UpdateTaxGroup(prismaTx, data)
            const result: sharedTaxGroupResType = { Success: true }
            return response.status(200).json(result)
        })
    } catch (error) {
        const result: sharedTaxGroupResType = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}

function reqValidations(data: sharedTaxGroupReqType) {
    if (data.taxGroup.description.length < 5) throw new Error('A descrição precisa ter no minímo 5 digítos')
    if (!data.taxGroup.id) throw new Error('Para editar um registro informe o id do grupo de tributação')
    if (!data.idUser) throw new Error('idUser não informado')
}

const UpdateTaxGroup = async (prismaTx: Prisma.TransactionClient, data: sharedTaxGroupReqType) => {

    validateRulesAddEditProduct(data)
    const taxGroup = await prismaTx.taxGroup.update({
        data: {
            description: data.taxGroup.description,
        }, where: {
            storeId_id: {
                id: data.taxGroup.id,
                storeId: data.idUser
            }
        }, select: {
            taxCofinsId: true,
            taxPisId: true,
            taxIpiId: true,
            taxIcms: { include: { taxIcmsNfe: true, taxIcmsNoPayer: true, taxIcmsNfce: true, taxIcmsOrigin: true, taxIcmsSt: true } }
        }
    })

    if (!taxGroup) throw new Error('Não foi encontrado grupo de tributação com esse id!')

    // ICMS
    const taxIcmsNfeUpdated = await prismaTx.taxIcmsNfe.update({
        data: {
            taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
            taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
            taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
            taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
            taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
            taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
            taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
        }, where: {
            id: taxGroup.taxIcms.taxIcmsNfeId
        }
    })

    const taxIcmsNoPayerUpdated = await prismaTx.taxIcmsNoPayer.update({
        data: {
            taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
            taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
            taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
        },
        where: {
            id: taxGroup.taxIcms.taxIcmsNoPayerId
        }
    })

    const taxIcmsNfceUpdated = await prismaTx.taxIcmsNfce.update({
        data: {
            taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
            taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
            taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
            taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
            taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
        }, where: {
            id: taxGroup.taxIcms.taxIcmsNfceId
        }
    })

    const taxIcmsSTUpdated = await prismaTx.taxIcmsST.update({
        data: {
            taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
            taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
            taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
            taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
            taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
            taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
            taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
            taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta
        }, where: {
            id: taxGroup.taxIcms.taxIcmsStId
        }
    })

    await prismaTx.taxIcms.update({
        data: {
            fcpAliquot: data.icms.TaxIcms.fcpAliquot,
            taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId,
            taxIcmsNfceId: taxIcmsNfceUpdated.id,
            taxIcmsNfeId: taxIcmsNfeUpdated.id,
            taxIcmsNoPayerId: taxIcmsNoPayerUpdated.id,
            taxIcmsStId: taxIcmsSTUpdated.id
        }, where: {
            id: taxGroup.taxIcms.id
        }
    })

    // COFINS
    await prismaTx.taxCofins.update({
        data: {
            taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
            taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
            taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
            taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
        }, where: {
            id: taxGroup.taxCofinsId
        }
    })

    // IPI
    await prismaTx.taxIpi.update({
        data: {
            taxAliquotIpi: data.ipi.taxAliquotIpi,
            taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
            taxCnpjProd: data.ipi.taxCnpjProd,
            taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
            taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
            taxCstIpiExitId: data.ipi.taxCstIpiExitId,
            taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
            taxStampIpi: data.ipi.taxStampIpi,
        }, where: {
            id: taxGroup.taxIpiId
        }
    })

    //PIS
    await prismaTx.taxPis.update({
        data: {
            taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
            taxAliquotPisExit: data.pis.taxAliquotPisExit,
            taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
            taxCstPisExitId: data.pis.taxCstPisExitId,
        }, where: {
            id: taxGroup.taxPisId
        }
    })


}