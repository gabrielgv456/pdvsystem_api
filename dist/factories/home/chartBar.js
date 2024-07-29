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
exports.default = chartsBar;
const index_1 = __importDefault(require("../../services/prisma/index"));
const utils_1 = require("../../utils/utils");
function chartsBar(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, lastPeriod } = request.query;
            if (!lastPeriod || !userId) {
                throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
            }
            const atualYear = new Date().getFullYear();
            const qtdMoths = (0, utils_1.createSequence)(Number(lastPeriod)); // add to changing months quantity
            const monthstoConsult = qtdMoths.map(month => month = new Date().getMonth() + 1 - month);
            const dataBarChart = [];
            yield Promise.all(monthstoConsult.map((monthConsult) => __awaiter(this, void 0, void 0, function* () {
                const year = monthConsult <= 0 ? atualYear - 1 : atualYear; //update year last year
                const month = monthConsult <= 0 ? monthConsult + 12 : monthConsult; //update months last year
                const initialDate = new Date(year, month - 1, 1);
                const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0);
                initialDate.setHours(0, 0, 1);
                finalDate.setHours(23, 59, 59);
                const VerifySells = yield index_1.default.sells.findMany({
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
                            { deleted: false }
                        ]
                    }
                });
                const sumSells = VerifySells.reduce((acc, item) => {
                    return acc + item.sellValue;
                }, 0);
                const medTicket = VerifySells.length === 0 ? 0 : sumSells / VerifySells.length;
                let totalProfit = 0;
                yield Promise.all(VerifySells.map((sell) => __awaiter(this, void 0, void 0, function* () {
                    const itemSell = yield index_1.default.itensSell.findMany({
                        where: {
                            AND: [{
                                    sellId: sell.id,
                                    storeId: parseInt(userId.toString())
                                }]
                        }
                    });
                    const listSellFiltered = itemSell.filter(item => { var _a; return (_a = item.totalCost) !== null && _a !== void 0 ? _a : 0 > 0; });
                    totalProfit = totalProfit + (listSellFiltered.map(item => item.totalValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => { var _a; return (_a = item.totalCost) !== null && _a !== void 0 ? _a : 0; }).reduce((prev, curr) => prev + curr, 0));
                })));
                //const listSellFiltered = VerifySells.filter(sell=>sell.cost > 0) 
                //const totalProfit = listSellFiltered.map(item => item.sellValue).reduce((prev, curr) => prev + curr, 0) - listSellFiltered.map(item => item.cost).reduce((prev, curr) => prev + curr, 0) ;   
                dataBarChart.push({ sumSells, month, medTicket, totalProfit, year, initialDate, finalDate });
                dataBarChart.sort(function (x, y) { return x.initialDate.getTime() - y.initialDate.getDate(); }); //order array
            })));
            return response.json({ Success: true, content: dataBarChart });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
