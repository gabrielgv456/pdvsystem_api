const prisma = require('../../services/prisma')

module.exports = async function chartBestSellers(request, response) {
    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

        const Sellers =
            await prisma.sellers.findMany({
                where: {
                    storeId: userId
                },
                select: {
                    id: true,
                    name: true
                }
            })

        await Promise.all(
            Sellers.map(async seller => {
                const SellsSellers = await prisma.sells.findMany({
                    where: {
                        AND: [{
                            created_at: {
                                gt: initialDate
                            }
                        },
                        {
                            created_at: {
                                lt: finalDate
                            }
                        },
                        { storeId: userId },
                        { sellerId: seller.id }

                        ]
                    },
                    orderBy: {
                        sellerId: 'asc'
                    }
                })

                const totalValueSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)

                await Promise.all(
                    SellsSellers.map(async sell => {
                        const ItensSellsSellers = await prisma.itensSell.findMany({
                            where: {
                                sellId: sell.id
                            }
                        })

                        sell.totalItens = ItensSellsSellers.length
                    })
                )

                const totalItensSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.totalItens
                }, 0)

                seller.totalValueSell = totalValueSell
                seller.totalItensSell = totalItensSell
            })

        )

        const firstsSellers = Sellers.filter((value, index) => index <= 3)
        firstsSellers.sort(function (x, y) { return y.totalValueSell - x.totalValueSell }) // odernar array

        if (Sellers) {
            return response.json({ Success: true, bestSellers: firstsSellers })
        }
        else {
            return response.json({ Success: false, erro: "Falha ao localizar dados dos melhores vendedores!" })
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}