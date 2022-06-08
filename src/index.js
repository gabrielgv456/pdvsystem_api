const { PrismaClient } = require('@prisma/client');
const express = require('express')
const {v4} = require('uuid')

const prisma = new PrismaClient()
const app = express();
const cors = require('cors')
const corsOptions = {
    origin: "http://localhost:3000",
    optionsSucessStatus: 200
}

app.use(express.json())
app.use(cors())
app.use(cors(corsOptions))

//type productsType = {
//  body:{
//   userId : number,
//  }
//}

app.post("/products", async (request, response) => {

    const { userId } = request.body
    
    if(userId){
    try {
        let listProducts = await prisma.products.findMany({
            where: { storeId: userId },
            select: { id: true, name: true, value: true }
        })
        if (listProducts == null) {
            return response.json({
                erro: "Nenhum produto encontrado para a loja informada"
            })
        }
        else {
            return response.json({

                listProducts

            })
        }
    }

    catch (error) {
        return response.json({ erro: error })
    }
}
})

app.post("/validate", async (request, response) => {
    try {
        const { token } = request.body

        let validateUser = await prisma.user.findFirst({ where: { Token: token } })
        if (validateUser.Token == token) {
            return response.json({
                valid: true,
                user: {
                    id: validateUser.id,
                    name: validateUser.name,
                    email: validateUser.email,

                },
                token: validateUser.Token
            })
        }
        if (validateUser.Token == null) {
            return response.json({ erro: "Token não encontrado!" })
        }
    }
    catch (error) {
        return response.json({ valid: false, error_message: "Token Invalido", error })
    }

})

app.post("/signin", async (request, response) => {

    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        let updatetoken = await prisma.user.update({where:{email:email}, data: {Token:uuidGenerated}})
        let validateUser = await prisma.user.findUnique({ where: { email: email } })

        if (validateUser.password == password) {

            return response.json({
                user: {
                    id: validateUser.id,
                    name: validateUser.name,
                    email: validateUser.email,

                },
                token: validateUser.Token
            })
        }
        if (validateUser == null) {
            return response.json({ erro: "Não foi encontrado usuarios com esse email" })
        }

    } catch (error) {
        return response.json({ error_message: "Usuario não encontrado", error })
    }
})


app.listen(2211, () => console.log('Server Up on 2211 port'));