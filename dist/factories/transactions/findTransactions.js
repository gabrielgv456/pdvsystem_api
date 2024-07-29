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
exports.default = deleteSell;
const index_1 = __importDefault(require("../../services/prisma/index"));
function deleteSell(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { datafindTransactions } = request.body;
        try {
            const findtransactions = yield index_1.default.transactions.findMany({
                orderBy: { id: 'desc' },
                where: {
                    AND: [{
                            storeId: datafindTransactions.userID,
                            created_at: {
                                gt: new Date(datafindTransactions.InitialDate)
                            }
                        },
                        {
                            created_at: {
                                lt: new Date(`${datafindTransactions.FinalDate}T23:59:59Z`)
                            }
                        },
                        { storeId: datafindTransactions.userId }
                    ]
                }
            });
            return response.json(findtransactions);
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
