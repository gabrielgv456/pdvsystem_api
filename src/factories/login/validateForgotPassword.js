//@ts-check

import validateFields from "../../utils/validateFields.js";
import { sendEmailChangePass } from '../../services/mail/index.js';
import prisma from '../../services/prisma/index.js';
import { generateNumberRandom } from "../../utils/utils.js";

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function validateForgotPassword(request, response) {
    try {
        const dataValidateForgotPassword = request.body
        validateFields(['email'], dataValidateForgotPassword)
        const codEmailValidate = generateNumberRandom()
        const storeInfo = await prisma.user.findUnique({
            where: { email: dataValidateForgotPassword.email }
        })
        if (!storeInfo) {
            throw new Error('Não encontrado usuário com o e-mail informado.')
        }
        sendEmailChangePass(storeInfo.email, codEmailValidate, storeInfo.name)
        await prisma.user.update({
            where: { id: storeInfo.id },
            data: { codEmailPass: codEmailValidate }
        })
        return response.json({ Success: true })
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}