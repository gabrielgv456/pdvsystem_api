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
exports.default = deleteLogo;
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function deleteLogo(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            (0, validateFields_1.default)(['storeId'], request.query);
            if (!request.query.storeId) {
                throw new Error('storeId não informado!');
            }
            yield index_1.default.user.update({
                where: {
                    id: parseInt((_a = request.query.storeId) === null || _a === void 0 ? void 0 : _a.toString())
                },
                data: {
                    urlLogo: null
                }
            });
            response.json({ Success: true });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
