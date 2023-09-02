const prisma = require('../../services/prisma')

module.exports = async function uploadFile(request, response) {
    try {
        dataUpload = request.query
        const updateUrl = await prisma.user.update({
            where: {
                id: parseInt(dataUpload.idStore)
            }, data :{
                urlLogo: dataUpload.url + '/' + request.file.path
            }
        })
        return response.json({ Success: true, url: updateUrl.urlLogo  })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}