module.exports = (prisma) => async function findSell(request, response) {
    
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

        let finalSellswithSellerorClientname = []

        await Promise.all(
            findsells.map(async (sell) => {
                if (sell.sellerId || sell.clientId) {
                    if (sell.sellerId && sell.clientId) {
                        const findSellersName = await prisma.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {

                                name: true
                            }
                        });

                        const findClientName = await prisma.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });

                        finalSellswithSellerorClientname.push({
                            clientName: findClientName.name,
                            sellerName: findSellersName.name,
                            ...sell
                        })
                    }
                    else if (sell.sellerId) {
                        const findSellersName = await prisma.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {

                                name: true
                            }
                        });
                        finalSellswithSellerorClientname.push({
                            sellerName: findSellersName.name,
                            ...sell
                        })
                    }
                    else if (sell.clientId) {
                        const findClientName = await prisma.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });
                        finalSellswithSellerorClientname.push({
                            clientName: findClientName.name,
                            ...sell
                        })
                    }


                }
                else {
                    finalSellswithSellerorClientname.push({ ...sell })
                }
            })
        )
        console.log(finalSellswithSellerorClientname)
        //const findsells = await prisma.$queryRaw`SELECT * FROM "public"."ItensSell" WHERE "created_at" = timestamp '2022-06-09 13:27:54' `

        if (findsells && findsellsproducts && finalSellswithSellerorClientname) {
            const finalreturn = { sells: [...finalSellswithSellerorClientname], sellsproducts: [...findsellsproducts] }
            return response.json(finalreturn)
        }
    }
    catch (error) {
        return response.status(400).json({ erro: error.message })
    }

}