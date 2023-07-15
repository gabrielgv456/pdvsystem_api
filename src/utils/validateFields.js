module.exports = function validateFields(fields,object) {
    requiredFields = fields
    requiredFields.map(item => {
        if (!(item in object)) {
            throw new Error('Campo obrigatório não informado: ' + item)
        }
    })
}