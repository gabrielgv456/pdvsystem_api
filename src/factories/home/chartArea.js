const prisma = require('../../services/prisma')

module.exports = async function chartsArea(request, response) {

    const { userId } = request.body
    const atualDate = new Date()
    const firstDayWeek = atualDate.getDate() - atualDate.getDay() // first day this week
    const endDayWeek = firstDayWeek + 6
    const qtdDays = [0, 1, 2, 3, 4, 5, 6] // change to add more days
    const daysToConsult = qtdDays.map(day => firstDayWeek + day)

    //var primeiroDiaDaSemana = new Date(dataAtual.setDate(primeiro)).toUTCString();
    //var ultimoDiaDaSemana = new Date(dataAtual.setDate(ultimo)).toUTCString();

    const SellsChartArea = []

    await Promise.all(
        daysToConsult.map(async day => {

            const initialDayConsult = new Date((new Date()).setDate(day))
            const initialHourDayConsult = new Date(initialDayConsult.setUTCHours(0, 0, 0, 0))
            const endHourDayConsult = new Date(initialDayConsult.setUTCHours(23, 59, 59, 59))
            const nameDay = new Date((new Date()).setDate(day)).toLocaleString('pt-br', { weekday: 'long' })


            try {
                const Sells = await prisma.sells.findMany({
                    where: {
                        AND: [{
                            created_at: {
                                gt: initialHourDayConsult
                            }
                        },
                        {
                            created_at: {
                                lt: endHourDayConsult
                            }
                        },
                        { storeId: userId },

                        ]
                    }
                })

                const totalSells = Sells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)

                const listSellFiltered = Sells.filter(sell=>sell.cost > 0) 
                const totalProfit = listSellFiltered.map(item => item.sellValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => item.cost).reduce((prev, curr) => prev + curr, 0) ;

                SellsChartArea.push({ totalSells, day, nameDay, totalProfit })
                SellsChartArea.sort(function (x, y) { return x.day - y.day }) // order array
            }
            catch (error) {
                return response.status(400).json({ Success: false, erro: error.message })
            }


        })
    )
    return response.json({ Success: true, SellsChartArea })
}