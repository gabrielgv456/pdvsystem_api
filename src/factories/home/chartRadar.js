const prisma = require('../../services/prisma')

module.exports = async function chartRadar(request, response) {
    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

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
                { storeId: userId },
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
                payment.quantity = payment._count.id
                delete payment._count
            })
        )

        return response.json({ Success: true, Payments })
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}