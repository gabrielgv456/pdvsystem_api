import prisma from '../../services/prisma/index'
import { createSequence } from '../../utils/utils'
import { Request, Response } from 'express'

type dataBarChartType = {
    sumSells: number 
    month: number 
    medTicket: number
    totalProfit: number 
    year: number 
    initialDate: Date 
    finalDate: Date
}

export default async function chartsBar(request:Request, response : Response) {

    try {
        const { userId, lastPeriod } = request.query
        if (!lastPeriod || !userId) {
            throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
        }
        const atualYear = new Date().getFullYear()
        const qtdMoths = createSequence(Number(lastPeriod)) // add to changing months quantity
        const monthstoConsult = qtdMoths.map(month => month = new Date().getMonth() + 1 - month)

        const dataBarChart: dataBarChartType[] = []

        await Promise.all(
            monthstoConsult.map(async monthConsult => {
                const year = monthConsult <= 0 ? atualYear - 1 : atualYear //update year last year
                const month = monthConsult <= 0 ? monthConsult + 12 : monthConsult //update months last year
                const initialDate = new Date(year, month - 1 , 1)                
                const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)
                initialDate.setHours(0, 0, 1)
                finalDate.setHours(23, 59,59)

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
                        { storeId: parseInt(userId.toString()) },
                        { deleted: false }

                        ]
                    }
                })

                const sumSells = VerifySells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)
                const medTicket = VerifySells.length === 0 ? 0 : sumSells / VerifySells.length

                let totalProfit = 0
                await Promise.all(
                    VerifySells.map(async sell => {
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

                //const listSellFiltered = VerifySells.filter(sell=>sell.cost > 0) 
                //const totalProfit = listSellFiltered.map(item => item.sellValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => item.cost).reduce((prev, curr) => prev + curr, 0) ;   

                dataBarChart.push({ sumSells, month, medTicket, totalProfit, year, initialDate, finalDate })
                dataBarChart.sort(function (x, y) { return x.initialDate.getTime() - y.initialDate.getTime() }) //order array
            }))
        return response.json({ Success: true, content: dataBarChart })

    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}