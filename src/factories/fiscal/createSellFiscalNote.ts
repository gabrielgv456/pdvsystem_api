import prisma from '../../services/prisma/index';
import { Request, Response } from 'express'

export const createSellFiscalNote = async (request:Request, response : Response) => {
    try {
        const { sellId, userId } = request.body;
        const sellData = await prisma.sells.findMany({
            include: {
                client: true,
                deliveries: true,
                itenssells: true,
                paymentsells: true
            }, where: {
                id: sellId
            }
        });
        return response.status(200).json({ Success: true, erro: 'Nota Emitida com sucesso' });

    } catch (error) {
        return response.status(400).json({ Success: false, erro: 'Erro ao emitir nota fiscal! ' + (error as Error).message });
    }
}