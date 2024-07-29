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
exports.default = findSellers;
const index_1 = __importDefault(require("../../services/prisma/index"));
function findSellers(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = request.body;
        if (userId) {
            try {
                const findSellers = yield index_1.default.sellers.findMany({
                    orderBy: { name: 'asc' },
                    where: {
                        storeId: userId
                    }
                });
                // if (findSellers.length === 0) {
                //     return response.json({ Success: false, erro: "ERRO: Nenhum vendedor encontrado com os dados fornecidos!" })
                // }
                // else {
                return response.json({ Success: true, findSellers });
                // }
            }
            catch (error) {
                return response.status(400).json({ Success: false, erro: error.message });
            }
        }
        else {
            return response.status(400).json({ Success: false, erro: "Dados invalidos, informe corretamente !" });
        }
    });
}
