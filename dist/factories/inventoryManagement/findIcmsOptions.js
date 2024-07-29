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
exports.default = findIcmsOptions;
const index_1 = __importDefault(require("../../services/prisma/index"));
function findIcmsOptions(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // ICMS Options
            const originOptions = yield index_1.default.taxIcmsOrigin.findMany();
            const cstOptions = yield index_1.default.taxIcmsCst.findMany();
            const exemptionOptions = yield index_1.default.taxReasonExemption.findMany();
            const cfopStateOptions = yield index_1.default.taxCfop.findMany({ where: { environment: 'estadual' }, orderBy: { id: 'asc' } });
            const cfopInterstateOptions = yield index_1.default.taxCfop.findMany({ where: { environment: 'interestadual' }, orderBy: { id: 'asc' } });
            const modalityOptions = yield index_1.default.taxModalityBCICMS.findMany();
            const cfopNfceOptions = yield index_1.default.taxCfop.findMany({ where: { type: 'nfce-nfe' }, orderBy: { id: 'asc' } });
            const cfopNfceDevolutionOptions = yield index_1.default.taxCfop.findMany({ where: { type: 'nfceDevolution' }, orderBy: { id: 'asc' } });
            //Ipi/Cofins/Pis Options
            const cstIpiEntranceOptions = yield index_1.default.taxCstIpi.findMany({ where: { type: 'exit' } });
            const cstIpiExitOptions = yield index_1.default.taxCstIpi.findMany({ where: { type: 'exit' } });
            const cstPisEntranceOptions = yield index_1.default.taxCstPis.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } });
            const cstPisExitOptions = yield index_1.default.taxCstPis.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } });
            const cstCofinsEntranceOptions = yield index_1.default.taxCstCofins.findMany({ where: { OR: [{ type: 'entrance' }, { type: 'exit/entrance' }] } });
            const cstCofinsExitOptions = yield index_1.default.taxCstCofins.findMany({ where: { OR: [{ type: 'exit' }, { type: 'exit/entrance' }] } });
            return response.json({
                Success: true,
                originOptions,
                cstOptions,
                exemptionOptions,
                cfopStateOptions,
                cfopInterstateOptions,
                modalityOptions,
                cfopNfceOptions,
                cfopNfceDevolutionOptions,
                cstIpiEntranceOptions,
                cstIpiExitOptions,
                cstPisEntranceOptions,
                cstPisExitOptions,
                cstCofinsEntranceOptions,
                cstCofinsExitOptions
            });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
