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
exports.default = deleteProduct;
const index_1 = __importDefault(require("../../services/prisma/index"));
function deleteProduct(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dataDeleteProduct } = request.body;
        try {
            const verifyIfExitsSellsThisProduct = yield index_1.default.itensSell.findFirst({
                where: { idProduct: dataDeleteProduct.id }
            });
            if (verifyIfExitsSellsThisProduct) {
                return response.json({ Success: false, Erro: 'Não é possivel excluir produtos que possuem vendas cadastradas! Realize a desativação clicando em editar.' });
            }
            else {
                const deleteTransationsProducts = yield index_1.default.transactionsProducts.deleteMany({
                    where: {
                        AND: [
                            { productId: dataDeleteProduct.id },
                            { storeId: dataDeleteProduct.storeId }
                        ]
                    }
                });
                const deleteproduct = yield index_1.default.products.deleteMany({
                    where: {
                        AND: [
                            { id: dataDeleteProduct.id },
                            { storeId: dataDeleteProduct.storeId }
                        ]
                    }
                });
                if (deleteTransationsProducts && deleteproduct) {
                    return response.json({ Success: true });
                }
            }
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
