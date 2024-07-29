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
exports.default = findSell;
const index_1 = __importDefault(require("../../services/prisma/index"));
function findSell(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { datafindSells } = request.body;
        try {
            const findsells = yield index_1.default.sells.findMany({
                orderBy: { id: 'desc' },
                where: {
                    AND: [{
                            created_at: {
                                gt: new Date(datafindSells.InitialDate)
                            }
                        },
                        {
                            created_at: {
                                lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                            }
                        },
                        { storeId: datafindSells.userId },
                        { deleted: false }
                    ]
                }
            });
            const findsellsproducts = yield index_1.default.itensSell.findMany({
                orderBy: { id: 'desc' },
                where: {
                    AND: [{
                            created_at: {
                                gt: new Date(datafindSells.InitialDate)
                            }
                        },
                        {
                            created_at: {
                                lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                            }
                        },
                        { storeId: datafindSells.userId },
                        { deleted: false }
                    ]
                }
            });
            let finalSellswithSellerorClientname = [];
            yield Promise.all(findsells.map((sell) => __awaiter(this, void 0, void 0, function* () {
                if (sell.sellerId || sell.clientId) {
                    if (sell.sellerId && sell.clientId) {
                        const findSellersName = yield index_1.default.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {
                                name: true
                            }
                        });
                        if (!findSellersName) {
                            throw new Error('Não foi localizado o nome do cliente');
                        }
                        const findClientName = yield index_1.default.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });
                        if (!findClientName) {
                            throw new Error('Não foi localizado o nome do cliente');
                        }
                        finalSellswithSellerorClientname.push(Object.assign({ clientName: findClientName.name, sellerName: findSellersName.name }, sell));
                    }
                    else if (sell.sellerId) {
                        const findSellersName = yield index_1.default.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {
                                name: true
                            }
                        });
                        if (!findSellersName) {
                            throw new Error('Não foi localizado o nome do cliente');
                        }
                        finalSellswithSellerorClientname.push(Object.assign({ sellerName: findSellersName.name }, sell));
                    }
                    else if (sell.clientId) {
                        const findClientName = yield index_1.default.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });
                        if (!findClientName) {
                            throw new Error('Não foi localizado o nome do cliente');
                        }
                        finalSellswithSellerorClientname.push(Object.assign({ clientName: findClientName.name }, sell));
                    }
                }
                else {
                    finalSellswithSellerorClientname.push(Object.assign({}, sell));
                }
            })));
            //const findsells = await prisma.$queryRaw`SELECT * FROM "public"."ItensSell" WHERE "created_at" = timestamp '2022-06-09 13:27:54' `
            if (findsells && findsellsproducts && finalSellswithSellerorClientname) {
                finalSellswithSellerorClientname.sort(function (y, x) { return x.created_at.getTime() - y.created_at.getTime(); });
                const finalreturn = { sells: [...finalSellswithSellerorClientname], sellsproducts: [...findsellsproducts] };
                return response.json(finalreturn);
            }
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
