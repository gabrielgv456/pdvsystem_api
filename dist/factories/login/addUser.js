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
exports.default = addUser;
const uuid_1 = require("uuid");
const bcrypt_1 = require("bcrypt");
const index_1 = require("../../services/mail/index");
const index_2 = __importDefault(require("../../services/prisma/index"));
const utils_1 = require("../../utils/utils");
function addUser(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password, name, masterkey, ownerName, phone } = request.body;
        try {
            const verifyExists = yield index_2.default.user.findUnique({
                where: { email: email }
            });
            if (verifyExists) {
                throw new Error('E-mail já cadastrado!');
            }
            const hashedpassword = yield (0, bcrypt_1.hash)(password, 11);
            const uuidGenerated = (0, uuid_1.v4)();
            const codEmailValidate = (0, utils_1.generateNumberRandom)();
            const addUserDb = yield index_2.default.user.create({
                data: {
                    email: email,
                    name: name,
                    password: hashedpassword,
                    Token: uuidGenerated,
                    masterkey: "safyra",
                    nameOwner: ownerName,
                    phone,
                    codEmailValidate
                }
            });
            (0, index_1.sendEmailVerifyMail)(email, codEmailValidate, ownerName);
            const idUser = addUserDb.id;
            if (addUserDb) {
                return response.json({ Success: true, codEmailValidate, idUser });
            }
            else {
                throw new Error('Falha ao adicionar registro!');
            }
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error });
        }
    });
}
