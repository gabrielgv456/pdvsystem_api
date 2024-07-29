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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = signIn;
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const index_1 = __importDefault(require("../../services/prisma/index"));
function signIn(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = request.body;
            const uuidGenerated = (0, uuid_1.v4)();
            const updatetoken = yield index_1.default.user.update({ where: { email: email }, data: { Token: uuidGenerated } });
            const validateUser = yield index_1.default.user.findUnique({ where: { email: email } });
            if (validateUser === null) {
                return response.json({ erro: "Não foi encontrado usuarios com esse email" });
            }
            else {
                if (yield (0, bcrypt_1.compare)(password, validateUser.password)) {
                    //delete validateUser.password
                    const { password } = validateUser, rest = __rest(validateUser, ["password"]);
                    return response.json({
                        user: rest,
                        token: validateUser.Token
                    });
                }
                else {
                    return response.json({ Success: false, erro: "Senha incorreta" });
                }
            }
        }
        catch (error) {
            return response.status(400).json({ error_message: "Usuario não encontrado", error });
        }
    });
}
