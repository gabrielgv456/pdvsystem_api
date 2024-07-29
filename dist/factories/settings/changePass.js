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
exports.default = changePass;
const bcrypt_1 = require("bcrypt");
const index_1 = __importDefault(require("../../services/prisma/index"));
const validateFields_1 = __importDefault(require("../../utils/validateFields"));
function changePass(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { storeId, actualPass, newPass } = request.body.data;
            (0, validateFields_1.default)(['storeId', 'actualPass', 'newPass'], request.body.data, true);
            const findUser = yield index_1.default.user.findUnique({ where: { id: storeId } });
            if (!findUser) {
                throw new Error("Não foi encontrado usuarios com esse id");
            }
            const hashedPassword = yield (0, bcrypt_1.hash)(newPass, 11);
            if (yield (0, bcrypt_1.compare)(actualPass, findUser.password)) {
                const changePassWord = yield index_1.default.user.update({
                    where: { id: storeId },
                    data: { password: hashedPassword }
                });
                if (changePassWord) {
                    return response.json({ Success: true });
                }
                else {
                    throw new Error("Falha ao atualizar senha!");
                }
            }
            else {
                throw new Error("Senha atual incorreta!");
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
