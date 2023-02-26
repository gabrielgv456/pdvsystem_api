module.exports = function () {
    return async function (request, response, next) {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(" ")

            if (token === process.env.TOKEN_API) {
                next()
            }
            else {
                return response.status(400).json({ erro: "Token inválido" })
            }
        }
        else {
            return response.status(400).json({ erro: "Token não informado" })
        }
    }
}