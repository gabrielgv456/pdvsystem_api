module.exports = (prisma) => async function validate(request, response) {
    try {
        const { token } = request.body

        const validateUser = await prisma.user.findFirst({ where: { Token: token } })
        if (validateUser.Token == token) {
            return response.json({
                valid: true,
                user: {
                    id: validateUser.id,
                    name: validateUser.name,
                    email: validateUser.email,
                    masterkey: validateUser.masterkey

                },
                token: validateUser.Token
            })
        }
        if (validateUser.Token == null) {
            return response.json({ erro: "Token não encontrado!" })
        }
    }
    catch (error) {
        return response.status(400).json({ valid: false, error_message: "Token Invalido", error: error.message })
    }
}