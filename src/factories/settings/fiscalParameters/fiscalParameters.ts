import { fiscalParametersError, fiscalParametersSuccess } from '@shared/api/settings/fiscalParameters'
import prisma from '../../../services/prisma/index'
import { Request, Response } from 'express'

export default async function fiscalParameters(request: Request, response: Response) {
    try {
        const { storeId } = request.query
        if (!storeId) {
            throw new Error('Informe o storeId!')
        }

        const findFiscalParameters = await prisma.user.findUnique({
            where: {
                id: parseInt(storeId.toString())
            },
            select: {
                lastNumberNF: true,
                lastNumberNFCE: true,
                passCert: true,
                validityCert: true,
                taxCrtId: true,
                taxRegimeId: true,
                taxCstPisId: true,
                taxCstPisAliquot: true,
                taxCstCofinsAliquot: true,
                taxCstCofinsId: true,
                fileCertId: true,
                fileCert: true,
                codCSC: true
            }
        })

        const fiscalParameters = {
            urlFileCert: ((findFiscalParameters.fileCert?.host ?? '') +
                (findFiscalParameters.fileCert?.path ?? '') +
                (findFiscalParameters.fileCert?.nameFile ?? '')) ?? null,
            passCert: null,
            ...findFiscalParameters
        }

        const crtOptions = await prisma.taxCrt.findMany()
        const cstCofinsOptions = await prisma.taxCstCofins.findMany()
        const cstPisOptions = await prisma.taxCstPis.findMany()
        const regimeOptions = await prisma.taxRegime.findMany()

        const result: fiscalParametersSuccess = { Success: true, fiscalParameters, crtOptions, cstCofinsOptions, cstPisOptions, regimeOptions }

        return response.json(result)
    } catch (error) {
        const result: fiscalParametersError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}