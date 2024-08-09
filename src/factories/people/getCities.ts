import { request } from 'http'
import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'

export default async function getCities(request: Request, response: Response) {

    try {
        const { city, ibge } = request.query

        if (ibge) {
            const cities = await prisma.cities.findMany({
                include: { state: true },
                where: { ibge: Number(ibge) }
            })
            return response.status(200).json({ Success: true, cities })
        }

        if (city) {

            const cities = await prisma.cities.findMany({
                include: { state: true },
                where: { name: { contains: String(city), mode: 'insensitive' } },
                take: 10,
                orderBy: {
                    name: 'asc'
                },
            })
            return response.status(200).json({ Success: true, cities })

        } else {

            const cities = await prisma.cities.findMany({
                include: { state: true },
                take: 10,
                orderBy: {
                    name: 'asc'
                }
            })
            return response.status(200).json({ Success: true, cities })

        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}