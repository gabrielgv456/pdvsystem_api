//import prisma from '../../services/prisma/index'
// export default async function uploadproductImage(request: Request, response: Response) {
//     try {
//         const dataUpload = request.query
//         if (!dataUpload.idStore) {throw new Error('idStore não informado!')}
//         const updateUrl = await prisma.products.update({
//             where: {
//                 id: parseInt(dataUpload.idStore.toString())
//             }, data :{
//                 urlImage: dataUpload.url + '/' + request.file?.path
//             }
//         })
//         return response.json({ Success: true, url: updateUrl.urlImage  })
//     } catch (error) {
//         return response.status(400).json({ Success: false, erro: (error as Error).message })
//     }
// }
