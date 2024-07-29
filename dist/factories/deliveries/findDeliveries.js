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
exports.default = findDeliveries;
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function findDeliveries(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const dataFindDeliveries = request.query;
            const requiredFields = ['storeId', 'initialDate', 'finalDate'];
            (0, validateFields_1.default)(requiredFields, dataFindDeliveries, true);
            if (!((_a = dataFindDeliveries.storeId) === null || _a === void 0 ? void 0 : _a.toString())) {
                throw new Error('storeId não informado!');
            }
            const resultDeliveries = yield index_1.default.deliveries.findMany({
                include: {
                    address: true,
                    client: true,
                    itemSell: { include: { sell: true } }
                },
                orderBy: { id: 'asc' },
                where: {
                    AND: [{
                            scheduledDate: {
                                gt: new Date(`${dataFindDeliveries.initialDate}T00:00:00Z`)
                            }
                        },
                        {
                            scheduledDate: {
                                lt: new Date(`${dataFindDeliveries.finalDate}T23:59:59Z`)
                            }
                        },
                        { storeId: parseInt(dataFindDeliveries.storeId.toString()) }
                    ]
                }
            });
            return response.json({ Success: true, resultDeliveries });
        }
        catch (error) {
            return response.status(400).json({ Success: false, Erro: error.message });
        }
    });
}
