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
exports.default = productsToSell;
const index_1 = __importDefault(require("../../services/prisma/index"));
function productsToSell(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        try {
            const { userId } = request.query;
            if (!userId) {
                throw new Error('Informe o userId');
            }
            const listProducts = yield index_1.default.products.findMany({
                include: {
                    image: true
                },
                orderBy: { name: 'asc' },
                where: { storeId: Number(userId) }
            });
            if (!listProducts) {
                throw new Error('Falha ao encontrar produtos!');
            }
            for (const product of listProducts) {
                //@ts-ignore
                product.totalValue = product.quantity * product.value;
                if (product.image) {
                    //@ts-ignore
                    product.urlImage = (_e = (((_a = product.image.host) !== null && _a !== void 0 ? _a : '') + ((_b = product.image.path) !== null && _b !== void 0 ? _b : '') + ((_d = (_c = product.image) === null || _c === void 0 ? void 0 : _c.nameFile) !== null && _d !== void 0 ? _d : ''))) !== null && _e !== void 0 ? _e : null;
                }
            }
            return response.json({
                Success: true,
                listProducts
            });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
