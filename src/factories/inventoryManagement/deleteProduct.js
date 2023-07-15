module.exports = (prisma) => async function deleteProduct(request, response) {
    
    const { dataDeleteProduct } = request.body


    try {
        const verifyIfExitsSellsThisProduct = await prisma.itensSell.findFirst({
            where: { idProduct: dataDeleteProduct.id }
        })
        if (verifyIfExitsSellsThisProduct) {
            return response.json({ Sucess: false, Erro: 'ERRO: Não é possivel excluir produtos que possuem vendas cadastradas!' })
        }

        else {
            const deleteTransationsProducts = await prisma.transactionsProducts.deleteMany({
                where: {
                    AND: [
                        { productId: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            const deleteproduct = await prisma.products.deleteMany({
                where: {
                    AND: [
                        { id: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            if (deleteTransationsProducts && deleteproduct) {
                return response.json({ Sucess: true })
            }
        }

    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}