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
exports.default = addClient;
const index_1 = __importDefault(require("../../services/prisma/index"));
function addClient(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, adressCep, adressCity, active, adressComplement, adressNeighborhood, adressNumber, adressState, adressStreet, birthDate, cellNumber, cpf, gender, name, phoneNumber, storeId, ie, suframa, taxPayerTypeId, taxRegimeId, finalCostumer } = request.body;
            const existsClient = yield index_1.default.clients.findMany({
                where: {
                    AND: [
                        { cpf },
                        { storeId }
                    ]
                },
                select: {
                    id: true
                }
            });
            if (existsClient.length > 0)
                throw new Error('Já existe cliente com o documento ' + cpf);
            const addClient = yield index_1.default.clients.create({
                data: {
                    email,
                    adressCep,
                    adressCity,
                    active,
                    adressComplement,
                    adressNeighborhood,
                    adressNumber,
                    adressState,
                    adressStreet,
                    birthDate,
                    cellNumber,
                    cpf,
                    gender,
                    name,
                    phoneNumber,
                    storeId,
                    ie,
                    suframa,
                    taxPayerTypeId,
                    taxRegimeId,
                    finalCostumer
                }
            });
            if (addClient) {
                return response.json({ Success: true, dataClient: addClient });
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
