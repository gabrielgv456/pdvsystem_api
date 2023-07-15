const ncm = require("../../utils/NCM.json")

module.exports = (prisma) => async function listNcm(request, response) {
    try {
        //https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json  ATUALIZAR NCM JSON

        //const validNCM = ncm.Nomenclaturas.filter(item => { item.Data_Inicio < new Date() })
        const ncmList = ncm.Nomenclaturas
        await Promise.all(
            ncmList.map(item => {
                delete item.Data_Fim
                delete item.Data_Inicio
                delete item.Ano_Ato
                delete item.Numero_Ato
                delete item.Tipo_Ato
            })
        )
        return response.json({ Success: true, ncmList })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}
