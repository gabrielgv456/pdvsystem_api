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
exports.default = findTransactionsProducts;
const index_1 = __importDefault(require("../../services/prisma/index"));
function findTransactionsProducts(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dataFindTransactionsProduct } = request.body;
        try {
            const findTransactionsProducts = yield index_1.default.transactionsProducts.findMany({
                orderBy: { id: 'desc' },
                where: {
                    AND: [
                        { productId: dataFindTransactionsProduct.id },
                        { storeId: dataFindTransactionsProduct.storeId }
                    ]
                }
            });
            return response.json({ Success: true, findTransactionsProducts });
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
