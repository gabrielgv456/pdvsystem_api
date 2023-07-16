const prisma = require('../../services/prisma')

module.exports = async function chartsBar(request, response) {
    
    const { userId } = request.body

    try {
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const qtdMoths = [0, 1, 2, 3, 4, 5] // add to changing months quantity
        const monthstoConsult = qtdMoths.map(month => month = new Date().getMonth() + 1 - month)

        const dataBarChart = []

        await Promise.all(
            monthstoConsult.map(async monthConsult => {
                const year = monthConsult <= 0 ? atualYear - 1 : atualYear //update year last year
                const month = monthConsult <= 0 ? monthConsult + 12 : monthConsult //update months last year
                const initialDate = new Date(month > 9 ? `${year}-${month}-01T03:00:00.000Z` : `${year}-0${month}-01T03:00:00.000Z`)
                const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

                const VerifySells = await prisma.sells.findMany({
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
                        { deleted: false }

                        ]
                    }
                })

                const sumSells = VerifySells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)
                const medTicket = VerifySells.length === 0 ? 0 : sumSells / VerifySells.length

                const listSellFiltered = VerifySells.filter(sell=>sell.cost > 0) 
                const totalProfit = listSellFiltered.map(item => item.sellValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => item.cost).reduce((prev, curr) => prev + curr, 0) ;   

                dataBarChart.push({ sumSells, month, medTicket, totalProfit, year, initialDate, finalDate })
                dataBarChart.sort(function (x, y) { return x.initialDate - y.initialDate }) //order array
            }))
        return response.json({ Success: true, dataBarChart })

    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}