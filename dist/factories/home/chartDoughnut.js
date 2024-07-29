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
exports.default = chartDoughnut;
const index_1 = __importDefault(require("../../services/prisma/index"));
function chartDoughnut(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, lastPeriod } = request.query;
            if (!lastPeriod || !userId) {
                throw new Error(`Parâmetros obrigatórios não informados: ${!lastPeriod && 'lastPeriod'} ${!userId && 'userId'}`);
            }
            const initialDate = new Date();
            initialDate.setMonth(new Date().getMonth() - (parseInt(lastPeriod.toString())));
            const finalDate = new Date();
            const searchsells = yield index_1.default.sells.findMany({
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
                }
            });
            const GenderClients = [];
            yield Promise.all(searchsells.map((sell) => __awaiter(this, void 0, void 0, function* () {
                if (sell.clientId === null) {
                    GenderClients.push({ gender: null });
                }
                else {
                    const searchGenderClients = yield index_1.default.clients.findUnique({
                        where: {
                            id: sell.clientId
                        }, select: {
                            gender: true
                        }
                    });
                    if (searchGenderClients) {
                        GenderClients.push(searchGenderClients);
                    }
                }
            })));
            const FemaleGender = GenderClients.filter(client => client.gender === "F");
            const MasculineGender = GenderClients.filter(client => client.gender === "M");
            const NotInformedGender = GenderClients.filter(client => client.gender === null);
            return response.json({
                Success: true,
                content: {
                    femaleGender: FemaleGender.length,
                    masculineGender: MasculineGender.length,
                    notInformedGender: NotInformedGender.length
                },
                GenderClients
            });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
