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
exports.default = aboutCorporation;
const index_1 = __importDefault(require("../../services/prisma/index"));
function aboutCorporation(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeId } = request.query;
            if (!storeId) {
                throw new Error('Informe o storeId!');
            }
            const resultAboutCorporation = yield index_1.default.user.findUnique({
                where: {
                    id: parseInt(storeId.toString())
                }, select: {
                    email: true,
                    name: true,
                    phone: true,
                    adressCep: true,
                    adressNeighborhood: true,
                    adressNumber: true,
                    adressState: true,
                    adressStreet: true,
                    adressCity: true,
                    cellPhone: true,
                    fantasyName: true,
                    cnpj: true,
                    ie: true
                }
            });
            if (!resultAboutCorporation) {
                throw new Error('Falha ao localizar dados sobre a empresa!');
            }
            return response.json({ Success: true, resultAboutCorporation });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
