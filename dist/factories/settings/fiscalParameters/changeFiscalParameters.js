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
exports.default = changeFiscalParameters;
const index_1 = __importDefault(require("../../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../../utils/validateFields"));
function changeFiscalParameters(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataChangeFiscalParameters = request.body;
            const requiredFields = ['storeId', 'taxCrtId', 'taxCstCofinsAliquot', 'taxCstCofinsId', 'taxCstPisAliquot', 'taxCstPisId', 'taxRegimeId',];
            (0, validateFields_1.default)(requiredFields, dataChangeFiscalParameters);
            yield index_1.default.user.update({
                where: {
                    id: dataChangeFiscalParameters.storeId
                },
                data: {
                    taxCrtId: dataChangeFiscalParameters.taxCrtId,
                    taxCstPisAliquot: dataChangeFiscalParameters.taxCstPisAliquot,
                    taxCstCofinsId: dataChangeFiscalParameters.taxCstCofinsId,
                    taxCstPisId: dataChangeFiscalParameters.taxCstPisId,
                    taxCstCofinsAliquot: dataChangeFiscalParameters.taxCstCofinsAliquot,
                    taxRegimeId: dataChangeFiscalParameters.taxRegimeId
                }
            });
            return response.json({ Success: true });
        }
        catch (error) {
            return response.status(400).json({ Success: false, Erro: error.message });
        }
    });
}
