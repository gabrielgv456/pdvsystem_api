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
exports.sendEmailVerifyMail = sendEmailVerifyMail;
exports.sendEmailChangePass = sendEmailChangePass;
const nodemailer_1 = require("nodemailer");
const smtp_1 = require("../../config/smtp");
const transporter = (0, nodemailer_1.createTransport)({
    host: smtp_1.host,
    port: smtp_1.port,
    secure: false,
    auth: {
        user: smtp_1.user,
        pass: smtp_1.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});
function sendEmailVerifyMail(email, codVerify, ownerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailSent = yield transporter.sendMail({
            subject: `Verificação de e-mail - Safyra - Código ${codVerify}`,
            from: 'no-reply@safyra.com.br',
            to: email,
            html: `
        <html>
            <body>
                Seu código de verificação é: <b> ${codVerify} </b> 
                <br/><br/>
                Hey, ${ownerName}, estamos muito contente que tenha interesse nos nossos serviços. Confirme agora seu e-mail para que possa ter acesso a plataforma!<br/>
                <br/><br/>
                Abraços, equipe Safyra ♡ <br/>

            </body>
        </html>
        `
        });
    });
}
function sendEmailChangePass(email, codVerify, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailSent = yield transporter.sendMail({
            subject: `Recuperação de Senha - Safyra - Código ${codVerify}`,
            from: 'no-reply@safyra.com.br',
            to: email,
            html: `
        <html>
            <body>
                Seu código de verificação é: <b> ${codVerify} </b> 
                <br/><br/>
                Hey, ${name}, <br/><br/> Informe o código acima para poder alterar a sua senha agora mesmo!<br/>
                <br/><br/>
                Abraços, equipe Safyra ♡ <br/>

            </body>
        </html>
        `
        });
    });
}
