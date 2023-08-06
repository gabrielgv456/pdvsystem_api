const prisma = require('../../services/prisma')
const validateFields = require('../../utils/validateFields');

module.exports = async function addDelivery(request, response) {
    const dataAddDelivery = request.body
    try {
        requiredFields = ['storeId']
        validateFields(requiredFields, dataAddDelivery)
        const addDelivery = prisma.$transaction(async(tx)=>{
            tx.deliveries
        }) 
        
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}