//@ts-check

export default function () {
    /**
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 */
    return async function (request, response, next) {
        const authHeader = request.headers.authorization;
        if (authHeader) {
            const [type, token] = authHeader.split(" ")

            if (token === process.env.TOKEN_API) {
                next()
            }
            else {
                return response.status(401).json({ erro: "Token inválido" })
            }
        }
        else {
            return response.status(401).json({ erro: "Token não informado" })
        }
    }
}