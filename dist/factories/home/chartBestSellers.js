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
exports.default = chartBestSellers;
const index_1 = __importDefault(require("../../services/prisma/index"));
function chartBestSellers(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = request.query;
            if (!userId) {
                throw new Error(`Parâmetros obrigatórios não informados: 'lastPeriod'`);
            }
            const atualMonth = new Date().getMonth() + 1;
            const atualYear = new Date().getFullYear();
            const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`);
            const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0);
            const Sellers = yield index_1.default.sellers.findMany({
                where: {
                    storeId: parseInt(userId.toString())
                },
                select: {
                    id: true,
                    name: true
                }
            });
            yield Promise.all(Sellers.map((seller) => __awaiter(this, void 0, void 0, function* () {
                const SellsSellers = yield index_1.default.sells.findMany({
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
                            { sellerId: seller.id }
                        ]
                    },
                    orderBy: {
                        sellerId: 'asc'
                    }
                });
                const totalValueSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.sellValue;
                }, 0);
                yield Promise.all(SellsSellers.map((sell) => __awaiter(this, void 0, void 0, function* () {
                    const ItensSellsSellers = yield index_1.default.itensSell.findMany({
                        where: {
                            sellId: sell.id
                        }
                    });
                    //@ts-ignore
                    sell.totalItens = ItensSellsSellers.length;
                })));
                const totalItensSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.totalItens;
                }, 0);
                //@ts-ignore
                seller.totalValueSell = totalValueSell;
                //@ts-ignore
                seller.totalItensSell = totalItensSell;
            })));
            const firstsSellers = Sellers.filter((value, index) => index <= 3); //@ts-ignore
            firstsSellers.sort(function (x, y) { return y.totalValueSell - x.totalValueSell; }); // odernar array
            if (Sellers) {
                return response.json({ Success: true, bestSellers: firstsSellers });
            }
            else {
                return response.json({ Success: false, erro: "Falha ao localizar dados dos melhores vendedores!" });
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
