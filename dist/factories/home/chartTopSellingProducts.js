"use strict";
//@ts-check
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
exports.default = chartTopSellingProducts;
const index_1 = __importDefault(require("../../services/prisma/index"));
function chartTopSellingProducts(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, lastPeriod } = request.query;
            if (!lastPeriod || !userId) {
                throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
            }
            const initialDate = new Date();
            initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())));
            const finalDate = new Date();
            const topSellingProducts = yield index_1.default.itensSell.groupBy({
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
                _sum: { quantity: true },
                by: ['idProduct'],
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5
            });
            yield Promise.all(topSellingProducts.map((sell) => __awaiter(this, void 0, void 0, function* () {
                sell.quantity = sell._sum.quantity;
                const findProducts = yield index_1.default.products.findUnique({
                    where: { id: sell.idProduct }
                });
                if (!findProducts) {
                    throw new Error(`Não foi encontrado o produto com id ${sell.idProduct}`);
                } //@ts-ignore
                sell.productName = findProducts.name; //@ts-ignore
                delete sell._sum;
            })));
            return response.json({ Success: true, content: topSellingProducts });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
