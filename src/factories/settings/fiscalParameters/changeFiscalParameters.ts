import { SharedChangeFiscalParametersRequest } from '@shared/api/settings/changeFiscalParameters';
import prisma from '../../../services/prisma/index';
import validateFields from '../../../utils/validateFields';
import { Request, Response } from 'express'
import { useFiscalApi } from '../../../services/api/fiscalApi';
import { getFileUrlAsBase64 } from '../../../utils/utils';

export default async function changeFiscalParameters(request: Request, response: Response) {
    try {

        const dataChangeFiscalParameters: SharedChangeFiscalParametersRequest = request.body
        const oldUserData = await prisma.user.findUnique({ where: { id: dataChangeFiscalParameters.storeId }, select: { fileCertId: true } })

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
                codCSC: dataChangeFiscalParameters.codCSC,
                positionYEmitDataNFe: dataChangeFiscalParameters.positionYEmitDataNFe,
                positionYLogoNFe: dataChangeFiscalParameters.positionYLogoNFe
            }
        })

        // Atualiza Certificado
        if ((dataChangeFiscalParameters.fileCertId) &&
            (oldUserData.fileCertId !== dataChangeFiscalParameters.fileCertId)) {
            try {
                const fileCert = await prisma.images.findUnique({ where: { id: dataChangeFiscalParameters.fileCertId } })
                if (!fileCert) throw new Error('Não foi encontrado o registro do arquivo!')
                const pathFileCert = ((fileCert.host ?? '') + (fileCert.path ?? '') + (fileCert.nameFile ?? '')) ?? null
                const pfxFile = await getFileUrlAsBase64(pathFileCert)
                const { uploadCert } = useFiscalApi()
                await uploadCert(pfxFile, dataChangeFiscalParameters.storeId)
            } catch (error) {
                throw new Error('Os dados foram salvos, porém ocorreu uma falha ao atualizar o certificado!' + (error as Error).message)
            }
        }

        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: (error as Error).message })
    }
}