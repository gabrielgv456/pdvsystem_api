import { SharedChangeFiscalParametersRequest } from '@shared/api/settings/changeFiscalParameters';
import prisma from '../../../services/prisma/index';
import validateFields from '../../../utils/validateFields';
import { Request, Response } from 'express'

export default async function changeFiscalParameters(request: Request, response: Response) {
    try {
        const dataChangeFiscalParameters: SharedChangeFiscalParametersRequest = request.body
        const requiredFields = ['storeId', 'taxCrtId', 'taxCstCofinsAliquot', 'taxCstCofinsId', 'taxCstPisAliquot', 'taxCstPisId', 'taxRegimeId',]
        validateFields(requiredFields, dataChangeFiscalParameters)
        await prisma.user.update({
            where: {
                id: dataChangeFiscalParameters.storeId
            },
            data: {
                taxCrtId: dataChangeFiscalParameters.taxCrtId,
                taxCstPisAliquot: dataChangeFiscalParameters.taxCstPisAliquot,
                taxCstCofinsId: dataChangeFiscalParameters.taxCstCofinsId,
                taxCstPisId: dataChangeFiscalParameters.taxCstPisId,
                taxCstCofinsAliquot: dataChangeFiscalParameters.taxCstCofinsAliquot,
                taxRegimeId: dataChangeFiscalParameters.taxRegimeId,
                fileCertId: dataChangeFiscalParameters.fileCertId,
                passCert: dataChangeFiscalParameters.passCert,
                validityCert: dataChangeFiscalParameters.validityCert,
                lastNumberNF: dataChangeFiscalParameters.lastNumberNF,
                lastNumberNFCE: dataChangeFiscalParameters.lastNumberNFCE,
                codCSC: dataChangeFiscalParameters.codCSC
            }
        })
        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }
}