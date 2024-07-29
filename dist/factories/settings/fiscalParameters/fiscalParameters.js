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
exports.default = fiscalParameters;
const index_1 = __importDefault(require("../../../services/prisma/index"));
function fiscalParameters(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeId } = request.query;
            if (!storeId) {
                throw new Error('Informe o storeId!');
            }
            const fiscalParameters = yield index_1.default.user.findUnique({
                where: {
                    id: parseInt(storeId.toString())
                },
                select: {
                    taxCrtId: true,
                    taxRegimeId: true,
                    taxCstPisId: true,
                    taxCstPisAliquot: true,
                    taxCstCofinsAliquot: true,
                    taxCstCofinsId: true
                }
            });
            const crtOptions = yield index_1.default.taxCrt.findMany();
            const cstCofinsOptions = yield index_1.default.taxCstCofins.findMany();
            const cstPisOptions = yield index_1.default.taxCstPis.findMany();
            const regimeOptions = yield index_1.default.taxRegime.findMany();
            return response.json({ Success: true, fiscalParameters, crtOptions, cstCofinsOptions, cstPisOptions, regimeOptions });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
