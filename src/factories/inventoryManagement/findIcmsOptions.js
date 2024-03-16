//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function findIcmsOptions(request, response) {
    try {
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


        return response.json({
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
            cstCofinsExitOptions
        })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}