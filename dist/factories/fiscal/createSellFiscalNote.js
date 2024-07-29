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
exports.createSellFiscalNote = void 0;
const index_1 = __importDefault(require("../../services/prisma/index"));
const createSellFiscalNote = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sellId, userId } = request.body;
        const sellData = yield index_1.default.sells.findMany({
            include: {
                client: true,
                deliveries: true,
                itenssells: true,
                paymentsells: true
            }, where: {
                id: sellId
            }
        });
        return response.status(200).json({ Success: true, erro: 'Nota Emitida com sucesso' });
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: 'Erro ao emitir nota fiscal! ' + error.message });
    }
});
exports.createSellFiscalNote = createSellFiscalNote;
