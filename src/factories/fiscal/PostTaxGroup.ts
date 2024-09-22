import { Prisma } from "@prisma/client"
import { sharedTaxGroupReqType, sharedTaxGroupResType } from "@shared/api/fiscal/CreatePutTaxGroup"
import { Request, Response } from "express"
import prisma from "../../services/prisma"
import { validateRulesAddEditProduct } from "../inventoryManagement/addProduct"

export const PostTaxGroup = async (request: Request, response: Response) => {

    try {
        await prisma.$transaction(async (prismaTx) => {
            const data: sharedTaxGroupReqType = request.body
            if (data.taxGroup.description.length < 5) throw new Error('A descrição precisa ter no minímo 5 digítos')
            if (!data.idUser) throw new Error('idUser não informado')
            await CreateTaxGroup(prismaTx, data)
            const result: sharedTaxGroupResType = { Success: true }
            return response.status(200).json(result)
        })
    } catch (error) {
        const result: sharedTaxGroupResType = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}


const CreateTaxGroup = async (prismaTx: Prisma.TransactionClient, data: sharedTaxGroupReqType) => {
    // ICMS
    validateRulesAddEditProduct(data)
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
    const lastGroupId = await prismaTx.taxGroup.findFirst({ orderBy: { code: 'desc' }, select: { code: true }, where: { storeId: data.idUser } })
    const taxGroup = await prismaTx.taxGroup.create({
        data: {
            individual: false,
            description: data.taxGroup.description,
            taxCofinsId: cofinsCreated.id,
            taxIcmsId: icmsCreated.id,
            taxIpiId: ipiCreated.id,
            taxPisId: pisCreated.id,
            storeId: data.idUser,
            code: (lastGroupId?.code ?? 0) + 1
        }
    })
}