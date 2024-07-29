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
exports.default = EditSeller;
const index_1 = __importDefault(require("../../services/prisma/index"));
function EditSeller(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        const { dataEditSeller } = request.body;
        if (dataEditSeller) {
            try {
                const editSeller = yield index_1.default.sellers.update({
                    where: {
                        id_storeId: {
                            id: dataEditSeller.idSeller,
                            storeId: dataEditSeller.storeId
                        }
                    },
                    data: {
                        email: dataEditSeller.email,
                        adressCep: dataEditSeller.adressCep,
                        adressCity: dataEditSeller.adressCity,
                        adressComplement: dataEditSeller.adressComplement,
                        adressNeighborhood: dataEditSeller.adressNeighborhood,
                        adressNumber: dataEditSeller.adressNumber,
                        adressState: dataEditSeller.adressState,
                        adressStreet: dataEditSeller.adressStreet,
                        birthDate: dataEditSeller.birthDate,
                        cellNumber: dataEditSeller.cellNumber,
                        cpf: dataEditSeller.cpf,
                        gender: dataEditSeller.gender,
                        name: dataEditSeller.name,
                        phoneNumber: dataEditSeller.phoneNumber,
                        active: dataEditSeller.active
                    }
                });
                if (editSeller) {
                    return response.json({ Success: true, dataSeller: editSeller });
                }
            }
            catch (error) {
                return response.status(400).json({ Success: false, erro: error.message });
            }
        }
        else {
            return response.status(400).json({ Success: false, erro: "Dados invalidos, informe corretamente !" });
        }
    });
}
