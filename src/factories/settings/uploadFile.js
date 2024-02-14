//@ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function uploadFile(request, response) {
    try {
        const dataUpload = request.query
        if (!dataUpload.idStore) {throw new Error('idStore não informado!')}
        const updateUrl = await prisma.user.update({
            where: {
                id: parseInt(dataUpload.idStore.toString())
            }, data :{
                urlLogo: dataUpload.url + '/' + request.file?.path
            }
        })
        return response.json({ Success: true, url: updateUrl.urlLogo  })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}