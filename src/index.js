const { PrismaClient } = require('@prisma/client');
const express = require('express')
const { v4 } = require('uuid')

const prisma = new PrismaClient()
const app = express();
const cors = require('cors');
const req = require('express/lib/request');
const atualdate = new Date()
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

// START SELLS //

app.post("/addsell", async (request, response) => {
    try {
        const { sell } = request.body
        
        let createSellonDB = await prisma.sells.create({data: {
            storeId:sell.UserId,
            sellValue:sell.totalValue,
            valuePayment:sell.valuePayment,
            
        }})
        
        await sell.Products.map(async (product) => {
            let createItensSellonDB = await prisma.itensSell.create({ data: { 
                storeId: sell.UserId, 
                sellId:createSellonDB.id,
                idProduct: product.id,
                quantity: product.quantity,
                valueProduct: product.initialvalue,
                totalValue: product.totalvalue,
                descriptionProduct: product.name
             } });
            console.log("Created Products",atualdate)
        })

        await sell.Payment.map(async (payment) => {
            let createPaymentSellonDB = await prisma.paymentSell.create({ data: { 
                storeId: sell.UserId, 
                sellId:createSellonDB.id,
                typepayment:payment.type,
                value: payment.value
             } });
            console.log("Created Payment",atualdate)
        })
        return response.json({ Success: true })
    }

    catch (error) {
        return response.json({ error })
    }
})

app.post("/signin", async (request, response) => {

    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        let updatetoken = await prisma.user.update({ where: { email: email }, data: { Token: uuidGenerated } })
        let validateUser = await prisma.user.findUnique({ where: { email: email } })

        if (validateUser.password == password) {

            return response.json({
                user: {
                    id: validateUser.id,
                    name: validateUser.name,
                    email: validateUser.email,
                    masterkey: validateUser.masterkey
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


app.post("/products", async (request, response) => {

    const { userId } = request.body

    if (userId) {
        try {
            let listProducts = await prisma.products.findMany({
                where: { storeId: userId },
                select: { id: true, name: true, value: true ,created_at:true}
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

// END SELLS //

// START CONTROL SELLS //

app.post("/findsells", async (request,response) => {
    const {datafindSells} = request.body
    
    try{
        let findsells = await prisma.sells.findMany({
            where: { AND: [{
                created_at : { 
                    gt: new Date (datafindSells.InitialDate)  
                }},
                  {
                     created_at : {
                         lt:new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                        }},
                        {storeId : datafindSells.userId}
                    
                    ]}
                })
        let findsellsproducts = await prisma.itensSell.findMany({
            where: { AND: [{
                created_at : { 
                    gt: new Date (datafindSells.InitialDate)  
                }},
                  {
                     created_at : {
                         lt:new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                        }},
                        {storeId : datafindSells.userId}
                    
                    ]}})
        
        //let findsells = await prisma.$queryRaw`SELECT * FROM "public"."ItensSell" WHERE "created_at" = timestamp '2022-06-09 13:27:54' `
        let finalreturn = {sells:[...findsells],sellsproducts:[...findsellsproducts]}
        return response.json(finalreturn)
    }
    catch (error){
        return response.json({erro:error})
    }
})
// END CONTROL SELLS //

// START TRANSCTIONS // 
app.post("/findtransactions", async (request,response) =>{

    const {datafindTransactions} = request.body
    try{
        let findtransactions = await prisma.paymentSell.findMany({
            where: { AND: [{
                created_at : { 
                    gt: new Date (datafindTransactions.InitialDate)  
                }},
                  {
                     created_at : {
                         lt:new Date(`${datafindTransactions.FinalDate}T23:59:59Z`)
                        }},
                        {storeId : datafindTransactions.userId}
                    
                    ]}
        })

        return response.json(findtransactions)
    }
    catch (error){
        return response.json({erro:error})

    }

})
// END TRANSACTIONS //

// START INVENTORY MANAGEMENT //

app.post("/addproduct", async(request,response) => {

        const {dataAddProduct} = request.body
        console.log(dataAddProduct)
        try {
            let addproduct = await prisma.products.create({data:{
                name:dataAddProduct.name,
                value:dataAddProduct.value,
                storeId:dataAddProduct.userId

            }})
            return response.json({Sucess:true})
        }
        catch(error){
            return response.json({erro:error})
        }

})

// END INVENTORY MANAGEMENT //
app.listen(2211, () => console.log('Server Up on 2211 port'));