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
exports.default = changeStatusDeliveries;
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function changeStatusDeliveries(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { dataChangeStatusDeliveries } = request.body;
            const requiredFields = ['storeId', 'itensSellToChange', 'newStatus'];
            (0, validateFields_1.default)(requiredFields, dataChangeStatusDeliveries);
            yield index_1.default.deliveries.updateMany({
                where: {
                    storeId: dataChangeStatusDeliveries.storeId,
                    itemSellId: { in: dataChangeStatusDeliveries.itensSellToChange }
                },
                data: {
                    status: dataChangeStatusDeliveries.newStatus,
                    deliveredDate: (_a = dataChangeStatusDeliveries.deliveredDate) !== null && _a !== void 0 ? _a : null
                }
            });
            return response.json({ Success: true });
        }
        catch (error) {
            return response.status(400).json({ Success: false, Erro: error.message });
        }
    });
}
