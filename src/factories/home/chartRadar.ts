import prisma from '../../services/prisma/index'
import { Request, Response } from 'express'


export default async function chartRadar(request: Request, response: Response) {
    try {
        const { userId, lastPeriod } = request.query
        if (!lastPeriod || !userId) {
            throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
        }
        const initialDate = new Date()
        initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())))
        const finalDate = new Date()

        const Payments = await prisma.paymentSell.groupBy({
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
            },
            _count: { id: true },
            by: ['typepayment'],
            orderBy: { typepayment: 'desc' },
            take: 5
        })

        await Promise.all(
            Payments.map(payment => {
                if (payment.typepayment === 'money') { payment.typepayment = 'Dinheiro' }
                if (payment.typepayment === 'creditcard') { payment.typepayment = 'Crédito' }
                if (payment.typepayment === 'debitcard') { payment.typepayment = 'Débito' }
                if (payment.typepayment === 'pix') { payment.typepayment = 'Pix' }
                if (payment.typepayment === 'others') { payment.typepayment = 'Outros' }
                if (payment.typepayment === 'onDelivery') { payment.typepayment = 'Na entrega' } //@ts-ignore
                payment.quantity = payment._count.id //@ts-ignore
                delete payment._count
            })
        )

        return response.json({ Success: true, content: Payments })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: (error as Error).message })
    }
}