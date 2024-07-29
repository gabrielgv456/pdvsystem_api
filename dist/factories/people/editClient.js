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
exports.default = editClient;
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function editClient(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requiredFields = [
                'idClient',
                'email',
                'adressCep',
                'adressCity',
                'active',
                'adressComplement',
                'adressNeighborhood',
                'adressNumber',
                'adressState',
                'adressStreet',
                'birthDate',
                'cellNumber',
                'cpf',
                'gender',
                'name',
                'phoneNumber',
                'storeId',
                'ie',
                'suframa',
                'taxPayerTypeId',
                'taxRegimeId',
                'finalCostumer'
            ];
            (0, validateFields_1.default)(requiredFields, request.body);
            const { idClient, email, adressCep, adressCity, active, adressComplement, adressNeighborhood, adressNumber, adressState, adressStreet, birthDate, cellNumber, cpf, gender, name, phoneNumber, storeId, ie, suframa, taxPayerTypeId, taxRegimeId, finalCostumer } = request.body;
            if (!idClient) {
                throw new Error('Informe o valor do idClient!');
            }
            if (!storeId) {
                throw new Error('Informe o valor do storeId!');
            }
            const existsClient = yield index_1.default.clients.findMany({
                where: {
                    AND: [
                        { cpf },
                        { storeId }
                    ], NOT: [
                        { id: idClient }
                    ]
                },
                select: {
                    id: true
                }
            });
            if (existsClient.length > 0)
                throw new Error('Já existe cliente com o documento ' + cpf);
            const editClient = yield index_1.default.clients.update({
                where: {
                    id_storeId: {
                        id: idClient,
                        storeId
                    }
                },
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
            if (editClient) {
                return response.json({ Success: true, dataClient: editClient });
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
