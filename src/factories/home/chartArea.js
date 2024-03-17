// @ts-check

import prisma from '../../services/prisma/index.js'
import { createSequence } from '../../utils/utils.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function chartsArea(request, response) {

    try {

        const { userId, lastPeriod } = request.query
        if (!lastPeriod || !userId) {
            throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
        }
        const qtdDays = createSequence(lastPeriod) // change to add more days
        const daysToConsult = qtdDays.map(day => {
            const date = new Date()
            date.setDate(date.getDate() - day)
            return date
        })
        
        const SellsChartArea = []

        await Promise.all(
            daysToConsult.map(async day => {

                const initialDayConsult = day
                const initialHourDayConsult = new Date(initialDayConsult.setUTCHours(0, 0, 0, 0))
                const endHourDayConsult = new Date(initialDayConsult.setUTCHours(23, 59, 59, 59))
                const nameDay = day.toLocaleString('pt-br', { weekday: 'long' })

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
                        { storeId: parseInt(userId.toString()) },

                        ]
                    }
                })

                const totalSells = Sells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)

                let totalProfit = 0
                await Promise.all(
                    Sells.map(async sell => {
                        const itemSell = await prisma.itensSell.findMany({
                            where: {
                                AND: [{
                                    sellId: sell.id,
                                    storeId: parseInt(userId.toString())
                                }]
                            }
                        })
                        const listSellFiltered = itemSell.filter(item => item.totalCost ?? 0 > 0)
                        totalProfit = totalProfit + (listSellFiltered.map(item => item.totalValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => item.totalCost ?? 0).reduce((prev, curr) => prev + curr, 0));

                    })
                )
                SellsChartArea.push({ totalSells, day, nameDay, totalProfit })
                SellsChartArea.sort(function (x, y) { return x.day - y.day }) // order array
            })
        )
        return response.json({ Success: true, content:SellsChartArea })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}