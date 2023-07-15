const bcrypt = require('bcrypt')


module.exports = (prisma) => async function changePass(request, response) {
    try {
        const { storeId, actualPass, newPass } = request.body.data;
        if (!storeId, !actualPass || !newPass) {
            throw new Error('Necessário informar todos parametros! (actualPass,newPass,storeId)')
        }
        const findUser = await prisma.user.findUnique({ where: { id: storeId } })

        if (findUser === null) {
            throw new Error("Não foi encontrado usuarios com esse id")
        }
        const hashedPassword = await bcrypt.hash(newPass, 11)
        if (await bcrypt.compare(actualPass, findUser.password)) {
            const changePassWord = await prisma.user.update({
                where: { id: storeId },
                data: { password: hashedPassword }
            })
            if (changePassWord) {
                return response.json({ Success: true })
            } else {
                throw new Error("Falha ao atualizar senha!")
            }
        } else {
            throw new Error("Senha atual incorreta!")
        }
    } catch (error) {
        return response.status(400).json({ Success: false, erro: error.message })
    }
}