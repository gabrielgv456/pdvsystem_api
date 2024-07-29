"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = chartRadar;
const index_1 = __importDefault(require("../../services/prisma/index"));
function chartRadar(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, lastPeriod } = request.query;
            if (!lastPeriod || !userId) {
                throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
            }
            const initialDate = new Date();
            initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())));
            const finalDate = new Date();
            const Payments = yield index_1.default.paymentSell.groupBy({
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
            });
            yield Promise.all(Payments.map(payment => {
                if (payment.typepayment === 'money') {
                    payment.typepayment = 'Dinheiro';
                }
                if (payment.typepayment === 'creditcard') {
                    payment.typepayment = 'Crédito';
                }
                if (payment.typepayment === 'debitcard') {
                    payment.typepayment = 'Débito';
                }
                if (payment.typepayment === 'pix') {
                    payment.typepayment = 'Pix';
                }
                if (payment.typepayment === 'others') {
                    payment.typepayment = 'Outros';
                }
                if (payment.typepayment === 'onDelivery') {
                    payment.typepayment = 'Na entrega';
                } //@ts-ignore
                payment.quantity = payment._count.id; //@ts-ignore
                delete payment._count;
            }));
            return response.json({ Success: true, content: Payments });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
