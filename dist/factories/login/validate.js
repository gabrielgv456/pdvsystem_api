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
exports.default = validate;
const index_1 = __importDefault(require("../../services/prisma/index"));
function validate(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { token } = request.body;
            const validateUser = yield index_1.default.user.findFirst({
                where: { Token: token }, select: {
                    adressCep: true, adressCity: true, adressNeighborhood: true, adressNumber: true,
                    adressState: true, adressStreet: true, cellPhone: true, cnpj: true, email: true, id: true, name: true,
                    phone: true, Token: true, urlLogo: true
                }
            });
            if (!(validateUser === null || validateUser === void 0 ? void 0 : validateUser.Token)) {
                throw new Error('Token não encotrado');
            }
            if (validateUser.Token === token) {
                return response.json({
                    valid: true,
                    user: validateUser,
                    token: validateUser.Token
                });
            }
        }
        catch (error) {
            return response.status(400).json({ valid: false, error_message: "Token Invalido", error: error.message });
        }
    });
}
