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
exports.default = verifyCodeForgotPassword;
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function verifyCodeForgotPassword(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, validateFields_1.default)(['email', 'codEmailValidate'], request.query);
            const { email, codEmailValidate } = request.query;
            const findUser = yield index_1.default.user.findUnique({ where: { email: email === null || email === void 0 ? void 0 : email.toString() } });
            if (!findUser) {
                throw new Error("Não foi encontrado usuarios com esse email");
            }
            if (findUser.codEmailPass !== (codEmailValidate === null || codEmailValidate === void 0 ? void 0 : codEmailValidate.toString())) {
                throw new Error("Código de validação incorreto!");
            }
            return response.json({ Success: true });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
