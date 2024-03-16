//@ts-check

import prisma from '../../services/prisma/index.js';
import validateFields from '../../utils/validateFields.js';

/**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 */

export default async function verifyCodeForgotPassword(request, response) {
    try {
        validateFields(['email', 'codEmailValidate'], request.query)

        const { email, codEmailValidate } = request.query;
        const findUser = await prisma.user.findUnique({ where: { email: email?.toString() } })

        if (!findUser) {
            throw new Error("Não foi encontrado usuarios com esse email")
        }
        if (findUser.codEmailPass !== codEmailValidate?.toString()) {
            throw new Error("Código de validação incorreto!")
        }

        return response.json({ Success: true })

    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}