import { sharedTaxOptions } from '@shared/api/inventoryManagement/findTaxOptions'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function findTaxOptions(request: Request, response: Response) {
    try {

        const { userId } = request.query
        if (!userId) throw new Error('id usuário não informado')
        // ICMS Options
        const originOptions = await prisma.taxIcmsOrigin.findMany()
        const cstOptions = await prisma.taxIcmsCst.findMany()
        const exemptionOptions = await prisma.taxReasonExemption.findMany()
        const cfopStateOptions = await prisma.taxCfop.findMany({ where: { environment: 'estadual' }, orderBy: { id: 'asc' } })
        const cfopInterstateOptions = await prisma.taxCfop.findMany({ where: { environment: 'interestadual' }, orderBy: { id: 'asc' } })
        const modalityOptions = await prisma.taxModalityBCICMS.findMany()
        const cfopNfceOptions = await prisma.taxCfop.findMany({ where: { type: 'nfce-nfe' }, orderBy: { id: 'asc' } })
        const cfopNfceDevolutionOptions = await prisma.taxCfop.findMany({ where: { type: 'nfceDevolution' }, orderBy: { id: 'asc' } })

        //Ipi/Cofins/Pis Options

        const cstIpiEntranceOptions = await prisma.taxCstIpi.findMany({ where: { type: 'exit' } })
        const cstIpiExitOptions = await prisma.taxCstIpi.findMany({ where: { type: 'exit' } })
        const cstPisEntranceOptions = await prisma.taxCstPis.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } })
        const cstPisExitOptions = await prisma.taxCstPis.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } })
        const cstCofinsEntranceOptions = await prisma.taxCstCofins.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } })
        const cstCofinsExitOptions = await prisma.taxCstCofins.findMany({ where: { OR: [{ type: 'exit' }, { type: 'exit/entrance' }] } })
        const taxGroupsOptions = await prisma.taxGroup.findMany({ where: { AND: [{ storeId: Number(userId) }, { individual: false }] }, select: { description: true, id: true, code: true } })

        const result: sharedTaxOptions = {
            Success: true,
            originOptions,
            cstOptions,
            exemptionOptions,
            cfopStateOptions,
            cfopInterstateOptions,
            modalityOptions,
            cfopNfceOptions,
            cfopNfceDevolutionOptions,
            cstIpiEntranceOptions,
            cstIpiExitOptions,
            cstPisEntranceOptions,
            cstPisExitOptions,
            cstCofinsEntranceOptions,
            cstCofinsExitOptions,
            taxGroupsOptions
        }

        return response.json(result)
    } catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}

