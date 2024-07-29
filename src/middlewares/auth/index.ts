import { Request, Response, NextFunction } from 'express'

export default function () {

    return async function (request: Request, response: Response, next: NextFunction) {
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