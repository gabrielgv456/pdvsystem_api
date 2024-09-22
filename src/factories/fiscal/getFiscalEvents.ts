import { sharedGetFiscalEventsError, sharedGetFiscalEventsSuccess } from "@shared/api/fiscal/getFiscalEvents"
import { Request, Response } from "express"
import prisma from "../../services/prisma"

export const fiscalEvents = async (request: Request, response: Response) => {
    try {
        const { sellId } = request.query

        const fiscalEvents = await prisma.fiscalEvents.findMany({
            include: {
                fiscalNote: {
                    select: {
                        numberNF: true, protocol: true, createdAt: true, keyNF: true
                    }
                }, fiscalEventType: true
            },
            where: { fiscalNote: { sellId: Number(sellId) } }
        })

        const result: sharedGetFiscalEventsSuccess = { Success: true, fiscalEvents }

        return response.status(200).json(result)
    } catch (error) {
        const result: sharedGetFiscalEventsError = { Success: false, erro: (error as Error).message }
        return response.status(400).json(result)
    }
}