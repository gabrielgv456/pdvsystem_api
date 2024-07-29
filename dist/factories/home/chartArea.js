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
exports.default = chartsArea;
const index_1 = __importDefault(require("../../services/prisma/index"));
const utils_1 = require("../../utils/utils");
function chartsArea(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, lastPeriod } = request.query;
            if (!lastPeriod || !userId) {
                throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
            }
            const qtdDays = (0, utils_1.createSequence)(Number(lastPeriod)); // change to add more days
            const daysToConsult = qtdDays.map(day => {
                const date = new Date();
                date.setDate(date.getDate() - day);
                return date;
            });
            const SellsChartArea = [];
            yield Promise.all(daysToConsult.map((day) => __awaiter(this, void 0, void 0, function* () {
                const initialDayConsult = day;
                const initialHourDayConsult = new Date(initialDayConsult.setUTCHours(0, 0, 0, 0));
                const endHourDayConsult = new Date(initialDayConsult.setUTCHours(23, 59, 59, 59));
                const nameDay = day.toLocaleString('pt-br', { weekday: 'long' });
                const Sells = yield index_1.default.sells.findMany({
                    where: {
                        AND: [{
                                created_at: {
                                    gt: initialHourDayConsult
                                }
                            },
                            {
                                created_at: {
                                    lt: endHourDayConsult
                                }
                            },
                            { storeId: parseInt(userId.toString()) },
                        ]
                    }
                });
                const totalSells = Sells.reduce((acc, item) => {
                    return acc + item.sellValue;
                }, 0);
                let totalProfit = 0;
                yield Promise.all(Sells.map((sell) => __awaiter(this, void 0, void 0, function* () {
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
                SellsChartArea.push({ totalSells, day, nameDay, totalProfit });
                SellsChartArea.sort(function (x, y) { return x.day.getTime() - y.day.getTime(); }); // order array
            })));
            return response.json({ Success: true, content: SellsChartArea });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
