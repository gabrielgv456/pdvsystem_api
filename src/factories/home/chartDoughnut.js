module.exports = (prisma) => async function chartDoughnut(request, response) {

    try {

        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

        const searchsells = await prisma.sells.findMany({
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

                ]
            }
        })

        const GenderClients = []

        await Promise.all(

            searchsells.map(async sell => {

                if (sell.clientId === null) {
                    GenderClients.push({ gender: null })
                }
                else {
                    const searchGenderClients = await prisma.clients.findUnique({
                        where: {
                            id: sell.clientId
                        }, select: {
                            gender: true
                        }
                    })
                    GenderClients.push(searchGenderClients)
                }
            })
        )

        const FemaleGender = GenderClients.filter(client => client.gender === "F")
        const MasculineGender = GenderClients.filter(client => client.gender === "M")
        const NotInformedGender = GenderClients.filter(client => client.gender === null)

        return response.json({
            Success: true,
            doughnutData: {
                femaleGender: FemaleGender.length,
                masculineGender: MasculineGender.length,
                notInformedGender: NotInformedGender.length
            },
            GenderClients
        })
    }

    catch (error) {

        return response.status(400).json({ Success: error.message })

    }
}