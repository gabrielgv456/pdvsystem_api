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
exports.default = addProduct;
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
const index_1 = __importDefault(require("../../services/prisma/index"));
function addProduct(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            const requiredFields = ['userId', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement'];
            (0, validateFields_1.default)(requiredFields, data.principal);
            yield index_1.default.$transaction((prismaTx) => __awaiter(this, void 0, void 0, function* () {
                const verifyCodRefExists = yield prismaTx.products.findMany({
                    where: {
                        AND: [{
                                codRef: data.principal.codRef
                            }, {
                                storeId: data.principal.userId
                            }]
                    }
                });
                if (verifyCodRefExists.length > 0) {
                    throw new Error(`Já existe produto cadastrado com o código de referência ${data.principal.codRef}`);
                }
                const addproduct = yield prismaTx.products.create({
                    data: {
                        name: data.principal.name,
                        codRef: data.principal.codRef,
                        exTipi: data.principal.exTipi,
                        brand: data.principal.brand,
                        value: data.principal.value,
                        storeId: data.principal.userId,
                        quantity: data.principal.quantity,
                        active: data.principal.active,
                        cost: data.principal.cost,
                        profitMargin: data.principal.profitMargin,
                        barCode: data.principal.barCode,
                        ncmCode: data.principal.ncmCode,
                        unitMeasurement: data.principal.unitMeasurement,
                        itemTypeId: data.principal.itemTypeId,
                        imageId: data.principal.imageId,
                    }
                });
                // taxes start
                const icmsCreated = yield prismaTx.taxIcms.create({
                    data: {
                        productId: addproduct.id,
                        fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                        taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId
                    }
                });
                yield prismaTx.taxIcmsNfe.create({
                    data: {
                        taxIcmsId: icmsCreated.id,
                        taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
                        taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
                        taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
                        taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
                        taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
                        taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
                    }
                });
                yield prismaTx.taxIcmsNoPayer.create({
                    data: {
                        taxIcmsId: icmsCreated.id,
                        taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                        taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
                    }
                });
                yield prismaTx.taxIcmsNfce.create({
                    data: {
                        taxIcmsId: icmsCreated.id,
                        taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                        taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                        taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                        taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                        taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
                    }
                });
                yield prismaTx.taxIcmsST.create({
                    data: {
                        taxIcmsId: icmsCreated.id,
                        taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
                        taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
                        taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
                        taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
                        taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
                        taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
                        taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
                        taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta
                    }
                });
                yield prismaTx.taxCofins.create({
                    data: {
                        productId: addproduct.id,
                        taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                        taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                        taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                        taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
                    }
                });
                yield prismaTx.taxIpi.create({
                    data: {
                        productId: addproduct.id,
                        taxAliquotIpi: data.ipi.taxAliquotIpi,
                        taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
                        taxCnpjProd: data.ipi.taxCnpjProd,
                        taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
                        taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
                        taxCstIpiExitId: data.ipi.taxCstIpiExitId,
                        taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
                        taxStampIpi: data.ipi.taxStampIpi,
                    }
                });
                yield prismaTx.taxPis.create({
                    data: {
                        productId: addproduct.id,
                        taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                        taxAliquotPisExit: data.pis.taxAliquotPisExit,
                        taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                        taxCstPisExitId: data.pis.taxCstPisExitId,
                    }
                });
                yield prismaTx.transactionsProducts.create({
                    data: {
                        type: "E",
                        description: "Criação do produto",
                        totalQuantity: data.principal.quantity,
                        quantity: data.principal.quantity,
                        productId: addproduct.id,
                        storeId: data.principal.userId
                    }
                });
                return response.json({ Success: true });
            }));
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
