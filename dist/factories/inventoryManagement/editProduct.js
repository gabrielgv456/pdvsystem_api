"use strict";
// @ts-check
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
exports.default = editProduct;
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
const index_1 = __importDefault(require("../../services/prisma/index"));
function editProduct(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = request.body;
            const requiredFields = ['userId', 'id', 'name', 'value', 'quantity', 'active', 'cost', 'profitMargin', 'barCode', 'ncmCode', 'cfopId', 'unitMeasurement'];
            (0, validateFields_1.default)(requiredFields, data.principal);
            yield index_1.default.$transaction((prismaTx) => __awaiter(this, void 0, void 0, function* () {
                if (!data.principal.id) {
                    throw new Error('Id do produto não informado!');
                }
                const searchProduct = yield prismaTx.products.findUnique({
                    where: {
                        id_storeId: { id: data.principal.id, storeId: data.principal.userId }
                    }
                });
                if (!searchProduct) {
                    throw new Error(`Não foi encontrado o produto informado ${data.principal.codRef}`);
                }
                if (data.principal.codRef) {
                    const verifyCodRefExists = yield prismaTx.products.findMany({
                        where: {
                            AND: [{
                                    codRef: data.principal.codRef
                                }, {
                                    storeId: data.principal.userId
                                }
                            ], NOT: {
                                id: searchProduct.id
                            }
                        }
                    });
                    if (verifyCodRefExists.length > 0) {
                        throw new Error(`Já existe produto cadastrado com o código de referência ${data.principal.codRef}`);
                    }
                }
                const editProduct = yield prismaTx.products.update({
                    data: {
                        name: data.principal.name,
                        codRef: data.principal.codRef,
                        exTipi: data.principal.exTipi,
                        brand: data.principal.brand,
                        value: data.principal.value,
                        quantity: data.principal.quantity,
                        active: data.principal.active,
                        cost: data.principal.cost,
                        profitMargin: data.principal.profitMargin,
                        barCode: data.principal.barCode,
                        ncmCode: data.principal.ncmCode,
                        unitMeasurement: data.principal.unitMeasurement,
                        itemTypeId: data.principal.itemTypeId,
                        imageId: data.principal.imageId,
                    }, where: {
                        id_storeId: {
                            id: data.principal.id,
                            storeId: data.principal.userId
                        }
                    }
                });
                // taxes start
                // UPDATE OR INSERT
                const icmsEdited = yield prismaTx.taxIcms.upsert({
                    where: {
                        productId: editProduct.id
                    },
                    update: {
                        fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                        taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId
                    },
                    create: {
                        fcpAliquot: data.icms.TaxIcms.fcpAliquot,
                        taxIcmsOriginId: data.icms.TaxIcms.taxIcmsOriginId,
                        productId: editProduct.id
                    }
                });
                yield prismaTx.taxIcmsNfe.upsert({
                    where: {
                        taxIcmsId: icmsEdited.id,
                    },
                    update: {
                        taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
                        taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
                        taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
                        taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
                        taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
                        taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
                    },
                    create: {
                        taxIcmsId: icmsEdited.id,
                        taxCstIcmsId: data.icms.TaxIcmsNfe.taxCstIcmsId,
                        taxCfopInterstateId: data.icms.TaxIcmsNfe.taxCfopInterstateId,
                        taxCfopStateId: data.icms.TaxIcmsNfe.taxCfopStateId,
                        taxModalityBCId: data.icms.TaxIcmsNfe.taxModalityBCId,
                        taxReasonExemptionId: data.icms.TaxIcmsNfe.taxReasonExemptionId,
                        taxAliquotIcms: data.icms.TaxIcmsNfe.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNfe.taxRedBCICMS
                    }
                });
                yield prismaTx.taxIcmsNoPayer.upsert({
                    where: {
                        taxIcmsId: icmsEdited.id
                    },
                    update: {
                        taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                        taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId
                    },
                    create: {
                        taxAliquotIcms: data.icms.TaxIcmsNoPayer.taxAliquotIcms,
                        taxRedBCICMS: data.icms.TaxIcmsNoPayer.taxRedBCICMS,
                        taxCstIcmsId: data.icms.TaxIcmsNoPayer.taxCstIcmsId,
                        taxIcmsId: icmsEdited.id
                    }
                });
                yield prismaTx.taxIcmsNfce.upsert({
                    where: {
                        taxIcmsId: icmsEdited.id,
                    },
                    update: {
                        taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                        taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                        taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                        taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                        taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId
                    },
                    create: {
                        taxCfopDevolutionId: data.icms.TaxIcmsNfce.taxCfopDevolutionId,
                        taxCfopId: data.icms.TaxIcmsNfce.taxCfopId,
                        taxRedBCICMS: data.icms.TaxIcmsNfce.taxRedBCICMS,
                        taxAliquotIcms: data.icms.TaxIcmsNfce.taxAliquotIcms,
                        taxCstIcmsId: data.icms.TaxIcmsNfce.taxCstIcmsId,
                        taxIcmsId: icmsEdited.id
                    }
                });
                yield prismaTx.taxIcmsST.upsert({
                    where: {
                        taxIcmsId: icmsEdited.id
                    },
                    update: {
                        taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
                        taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
                        taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
                        taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
                        taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
                        taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
                        taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
                        taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta
                    }, create: {
                        taxAliquotIcmsInner: data.icms.TaxIcmsST.taxAliquotIcmsInner,
                        taxCfopInterstateIdSt: data.icms.TaxIcmsST.taxCfopInterstateIdSt,
                        taxCstIcmsStId: data.icms.TaxIcmsST.taxCstIcmsStId,
                        taxCfopStateIdSt: data.icms.TaxIcmsST.taxCfopStateIdSt,
                        taxModalityBCIdSt: data.icms.TaxIcmsST.taxModalityBCIdSt,
                        taxRedBCICMSInner: data.icms.TaxIcmsST.taxRedBCICMSInner,
                        taxRedBCICMSSt: data.icms.TaxIcmsST.taxRedBCICMSSt,
                        taxMvaPauta: data.icms.TaxIcmsST.taxMvaPauta,
                        taxIcmsId: icmsEdited.id
                    }
                });
                yield prismaTx.taxCofins.upsert({
                    where: {
                        productId: editProduct.id
                    },
                    update: {
                        taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                        taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                        taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                        taxCstCofinsExitId: data.cofins.taxCstCofinsExitId
                    }, create: {
                        taxAliquotCofinsEntrance: data.cofins.taxAliquotCofinsEntrance,
                        taxAliquotCofinsExit: data.cofins.taxAliquotCofinsExit,
                        taxCstCofinsEntranceId: data.cofins.taxCstCofinsEntranceId,
                        taxCstCofinsExitId: data.cofins.taxCstCofinsExitId,
                        productId: editProduct.id
                    }
                });
                yield prismaTx.taxIpi.upsert({
                    where: {
                        productId: editProduct.id
                    },
                    update: {
                        taxAliquotIpi: data.ipi.taxAliquotIpi,
                        taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
                        taxCnpjProd: data.ipi.taxCnpjProd,
                        taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
                        taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
                        taxCstIpiExitId: data.ipi.taxCstIpiExitId,
                        taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
                        taxStampIpi: data.ipi.taxStampIpi,
                    },
                    create: {
                        taxAliquotIpi: data.ipi.taxAliquotIpi,
                        taxClassificationClassIpi: data.ipi.taxClassificationClassIpi,
                        taxCnpjProd: data.ipi.taxCnpjProd,
                        taxCodEnquadLegalIpi: data.ipi.taxCodEnquadLegalIpi,
                        taxCstIpiEntranceId: data.ipi.taxCstIpiEntranceId,
                        taxCstIpiExitId: data.ipi.taxCstIpiExitId,
                        taxQtdStampControlIpi: data.ipi.taxQtdStampControlIpi,
                        taxStampIpi: data.ipi.taxStampIpi,
                        productId: editProduct.id
                    }
                });
                yield prismaTx.taxPis.upsert({
                    where: {
                        productId: editProduct.id
                    },
                    update: {
                        taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                        taxAliquotPisExit: data.pis.taxAliquotPisExit,
                        taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                        taxCstPisExitId: data.pis.taxCstPisExitId,
                    },
                    create: {
                        taxAliquotPisEntrance: data.pis.taxAliquotPisEntrance,
                        taxAliquotPisExit: data.pis.taxAliquotPisExit,
                        taxCstPisEntranceId: data.pis.taxCstPisEntranceId,
                        taxCstPisExitId: data.pis.taxCstPisExitId,
                        productId: editProduct.id
                    }
                });
                if (searchProduct.quantity > data.principal.quantity) {
                    yield prismaTx.transactionsProducts.create({
                        data: {
                            type: "S",
                            description: "Ajuste de estoque",
                            totalQuantity: data.principal.quantity,
                            quantity: searchProduct.quantity - data.principal.quantity,
                            productId: data.principal.id,
                            storeId: data.principal.userId
                        }
                    });
                }
                if (searchProduct.quantity < data.principal.quantity) {
                    yield prismaTx.transactionsProducts.create({
                        data: {
                            type: "E",
                            description: "Ajuste de estoque",
                            totalQuantity: data.principal.quantity,
                            quantity: data.principal.quantity - searchProduct.quantity,
                            productId: data.principal.id,
                            storeId: data.principal.userId
                        }
                    });
                }
                return response.json({ Success: true });
            }));
        }
        catch (error) {
            return response.status(400).json({ erro: error.message });
        }
    });
}
