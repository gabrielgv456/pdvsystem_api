import { Request, Response } from 'express'
import prisma from '../../services/prisma/index'
import { Sells } from '@prisma/client'

type SellswithSellerorClientnameType = adicionalSellType & Sells

type adicionalSellType = {
    existsFiscalNote: boolean
}

export default async function findSell(request: Request, response: Response) {

    const { datafindSells } = request.body

    try {
        const findsells = await prisma.sells.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    created_at: {
                        gt: new Date(datafindSells.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindSells.userId },
                { deleted: false }

                ]
            },
            include: {
                client: true,
                seller: true
            }
        })

        const findsellsproducts = await prisma.itensSell.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    created_at: {
                        gt: new Date(datafindSells.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindSells.userId },
                { deleted: false }

                ]
            }
        })

        let finalSellswithSellerorClientname: SellswithSellerorClientnameType[] = []

        await Promise.all(
            findsells.map(async (sell) => {
                const fiscalNotes = await prisma.fiscalNotes.findFirst({
                    where: {
                        AND: [
                            { sellId: sell.id },
                            { statusNFId: 1 } // status 1 autorizada
                        ]
                    }
                })
                finalSellswithSellerorClientname.push({
                    existsFiscalNote: fiscalNotes ? fiscalNotes.id > 0 : false,
                    ...sell
                })
            })
        )
        //const findsells = await prisma.$queryRaw`SELECT * FROM "public"."ItensSell" WHERE "created_at" = timestamp '2022-06-09 13:27:54' `

        if (findsells && findsellsproducts && finalSellswithSellerorClientname) {
            finalSellswithSellerorClientname.sort(function (y, x) { return x.created_at.getTime() - y.created_at.getTime() })
            const finalreturn = { sells: [...finalSellswithSellerorClientname], sellsproducts: [...findsellsproducts] }
            console.log(findsells)
            return response.json(finalreturn)
        }
    }
    catch (error) {
        return response.status(400).json({ erro: (error as Error).message })
    }

}