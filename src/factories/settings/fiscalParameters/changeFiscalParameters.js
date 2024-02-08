const prisma = require('../../../services/prisma')
const validateFields = require('../../../utils/validateFields');

module.exports = async function changeFiscalParameters(request, response) {
    try {
        const  dataChangeFiscalParameters  = request.body
        requiredFields = ['storeId', 'taxCrtId', 'taxCstCofinsAliquot', 'taxCstCofinsId', 'taxCstPisAliquot', 'taxCstPisId', 'taxRegimeId',]
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
                taxRegimeId: dataChangeFiscalParameters.taxRegimeId
            }
        })
        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, Erro: error.message })
    }
}