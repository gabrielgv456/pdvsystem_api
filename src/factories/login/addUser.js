const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const sendEmail = require('../../services/mail')

module.exports = (prisma) => async function addUser(request, response) {
    const { email, password, name, masterkey, ownerName, phone } = request.body

    try {
        const verifyExists = await prisma.user.findUnique({
            where: { email: email }
        })
        if (verifyExists) {
            throw new Error('E-mail já cadastrado!')
        }
        const hashedpassword = await bcrypt.hash(password, 11)
        const uuidGenerated = v4()
        function generateRandom() {
            var stringAleatoria = '';
            var caracteres = '0123456789';
            for (var i = 0; i < 6; i++) {
                stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
            }
            return stringAleatoria;
        }
        const codEmailValidate = generateRandom()

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

        const mailConfirm = sendEmail(email, codEmailValidate, ownerName)
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