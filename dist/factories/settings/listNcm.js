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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listNcm;
const fs_1 = require("fs");
const path_1 = require("path");
const filePath = (0, path_1.join)(__dirname, '../../utils/NCM.json');
const nomenclaturas = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf-8'));
function listNcm(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json  ATUALIZAR NCM JSON
            //const validNCM = ncm.Nomenclaturas.filter(item => { item.Data_Inicio < new Date() })
            const ncmList = nomenclaturas;
            for (const item of ncmList) {
                delete item.Data_Fim;
                delete item.Data_Inicio;
                delete item.Ano_Ato;
                delete item.Numero_Ato;
                delete item.Tipo_Ato;
            }
            return response.json({ Success: true, ncmList });
        }
        catch (error) {
            return response.status(400).json({ Success: false, erro: error.message });
        }
    });
}
