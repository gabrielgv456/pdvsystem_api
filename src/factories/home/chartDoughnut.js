// @ts-check

import prisma from '../../services/prisma/index.js'

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function chartDoughnut(request, response) {

    try {
        const { userId, lastPeriod } = request.query
        if (!lastPeriod || !userId) {
            throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId' }`);
        }
        const initialDate = new Date()
        initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())))
        const finalDate = new Date()

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
                { storeId: parseInt(userId.toString()) },

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
            content: {
                femaleGender: FemaleGender.length,
                masculineGender: MasculineGender.length,
                notInformedGender: NotInformedGender.length
            },
            GenderClients
        })
    }

    catch (error) {

        return response.status(400).json({ Success: false, erro: error.message })

    }
}