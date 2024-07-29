import { v4 } from 'uuid'
import { hash } from 'bcrypt'
import { sendEmailVerifyMail } from '../../services/mail/index'
import prisma from '../../services/prisma/index'
import { generateNumberRandom } from '../../utils/utils'
import { Request, Response } from 'express'

export default async function addUser(request: Request, response: Response) {
    const { email, password, name, masterkey, ownerName, phone } = request.body

    try {
        const verifyExists = await prisma.user.findUnique({
            where: { email: email }
        })
        if (verifyExists) {
            throw new Error('E-mail já cadastrado!')
        }
        const hashedpassword = await hash(password, 11)
        const uuidGenerated = v4()

        const codEmailValidate = generateNumberRandom()

        const addUserDb = await prisma.user.create({
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
        })

        sendEmailVerifyMail(email, codEmailValidate, ownerName)
        const idUser = addUserDb.id

        if (addUserDb) {
            return response.json({ Success: true, codEmailValidate, idUser })
        } else {
            throw new Error('Falha ao adicionar registro!')
        }
    }
    catch (error) {
        return response.status(400).json({ Success: false, erro: error })
    }
}