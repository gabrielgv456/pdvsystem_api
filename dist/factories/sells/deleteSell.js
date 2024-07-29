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
        const dataDeleteSell = request.body.dataDeleteSell;
        try {
            yield index_1.default.$transaction((prismaTx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const deliveriesShipping = yield prismaTx.deliveries.findMany({
                    where: {
                        status: 'Shipping',
                        sellId: dataDeleteSell.SellId,
                        storeId: dataDeleteSell.UserId
                    }
                });
                if (deliveriesShipping.length > 0)
                    throw new Error('Existe(m) entrega(s) dessa venda com status "Em entrega", realize a conclusão antes de realizar o estorno!');
                dataDeleteSell.Products.map((product) => __awaiter(this, void 0, void 0, function* () {
                    const searchProduct = yield prismaTx.products.findUnique({
                        where: {
                            id: product.idProduct
                        }
                    });
                    if (!searchProduct) {
                        throw new Error(`Não foi encontrado produto com o id ${product.idProduct}`);
                    }
                    const updateQntProduct = yield prismaTx.products.update({
                        where: {
                            id: searchProduct.id
                        },
                        data: {
                            quantity: searchProduct.quantity + product.quantity
                        }
                    });
                    yield prismaTx.transactionsProducts.create({
                        data: {
                            type: 'E',
                            description: 'Estorno de Venda',
                            quantity: product.quantity,
                            totalQuantity: updateQntProduct.quantity,
                            productId: product.idProduct,
                            storeId: dataDeleteSell.UserId
                        }
                    });
                }));
                const deleteSellonDB = yield prismaTx.sells.update({
                    where: {
                        id_storeId: {
                            id: dataDeleteSell.SellId,
                            storeId: dataDeleteSell.UserId
                        }
                    },
                    data: {
                        deleted: true
                    }
                });
                yield prismaTx.itensSell.updateMany({
                    where: {
                        AND: [
                            { sellId: dataDeleteSell.SellId },
                            { storeId: dataDeleteSell.UserId }
                        ]
                    },
                    data: {
                        deleted: true
                    }
                });
                yield prismaTx.deliveries.updateMany({
                    where: {
                        AND: [
                            { sellId: dataDeleteSell.SellId },
                            { storeId: dataDeleteSell.UserId },
                            { status: 'Pending' }
                        ]
                    }, data: {
                        status: 'Canceled - Pending'
                    }
                });
                yield prismaTx.deliveries.updateMany({
                    where: {
                        AND: [
                            { sellId: dataDeleteSell.SellId },
                            { storeId: dataDeleteSell.UserId },
                            { status: 'Done' }
                        ]
                    }, data: {
                        status: 'Canceled - Done'
                    }
                });
                if (dataDeleteSell.AddExitTransaction) {
                    const deliveriesPendingToPay = yield prismaTx.deliveries.findFirst({
                        where: {
                            AND: [
                                { sellId: dataDeleteSell.SellId },
                                { storeId: dataDeleteSell.UserId }
                            ]
                        }, select: { onDeliveryPayValue: true }
                    });
                    yield prismaTx.transactions.create({
                        data: {
                            description: 'Estorno de Venda',
                            type: 'exit',
                            value: dataDeleteSell.SellValue - ((_a = deliveriesPendingToPay === null || deliveriesPendingToPay === void 0 ? void 0 : deliveriesPendingToPay.onDeliveryPayValue) !== null && _a !== void 0 ? _a : 0),
                            sellId: dataDeleteSell.SellId,
                            storeId: dataDeleteSell.UserId
                        }
                    });
                }
                if (dataDeleteSell.removeTransaction) {
                    const deleteTransaction = yield prismaTx.transactions.deleteMany({
                        where: {
                            AND: [
                                { storeId: dataDeleteSell.UserId },
                                { sellId: dataDeleteSell.SellId }
                            ]
                        }
                    });
                    if (deleteTransaction.count === 0) {
                        throw new Error('Falha ao remover recebimento!');
                    }
                }
                if (!deleteSellonDB) {
                    response.json({ Success: false, erro: "Nenhum registro encontrado com os parametros fornecidos" });
                }
                else {
                    response.json({ Success: true, deleteSellonDB });
                }
            }));
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
