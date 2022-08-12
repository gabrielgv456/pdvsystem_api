const { PrismaClient, Prisma } = require('@prisma/client');
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
        console.log(sell)
        let createSellonDB = await prisma.sells.create({data: {
            storeId:sell.UserId,
            sellValue:sell.totalValue,
            valuePayment:sell.valuePayment,
            
        }})

        await sell.Products.map(async (product) => {
            
            let searchProduct = await prisma.products.findUnique({
                where:{
                    id:product.id
                }
            })
            if (product.quantity > searchProduct.quantity) {
                return('quantidade maior do que o saldo')
                
            } else {
                    let updateQuantityProduct = await prisma.products.update({
                        where:{
                            id: product.id
                        },
                        data:{
                            quantity: searchProduct.quantity - product.quantity
                        }
                    
                    })
                    let createTransactionProduct = await prisma.transactionsProducts.create({data:{
                        type: "S",
                        description:"Venda",
                        totalQuantity: searchProduct.quantity - product.quantity,
                        quantity:product.quantity,
                        productId:searchProduct.id,
                        storeId: searchProduct.storeId
            }})
            }
        })
        

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
            let createPaymentTransaction = await prisma.transactions.create({ data: {
                type: payment.type,
                description: "Recebimento de venda",
                value: payment.value,
                sellId: createSellonDB.id,
                storeId: sell.UserId
            }})
        })
        return response.json({ Success: true })
    }

    catch (error) {
        return response.json({ Success: false, Erro: error })
    }
})

app.post("/deletesell", async (request,response) => {

    const {dataDeleteSell} = request.body

    try{

        dataDeleteSell.Products.map(async product=>{
            let searchProduct = await prisma.products.findUnique({
                where: {
                    id: product.idProduct
                }
            })
            let updateQntProduct = await prisma.products.update({
                where: {
                    id: searchProduct.id
                },
                data: {
                    quantity : searchProduct.quantity + product.quantity
                }
            })
            let addTransaction = await prisma.transactionsProducts.create({
                data: {
                    type: 'E',
                    description: 'Estorno de Venda',
                    quantity: product.quantity,
                    totalQuantity: updateQntProduct.quantity,
                    productId: product.idProduct,
                    storeId: dataDeleteSell.UserId
                }
            })
        })


        let deleteSellonDB = await prisma.sells.updateMany({

            where:
            {
                AND: [
                    { id : {equals: dataDeleteSell.SellId  } },
                    { storeId: {equals:  dataDeleteSell.UserId } }
                ]
            },

            data:
            {
                deleted: true
            }
            
        })

        let deleteItensSellonDB = await prisma.itensSell.updateMany({
            where:
            {
                AND: [
                    { sellId : {equals: dataDeleteSell.SellId  } },
                    { storeId: {equals:  dataDeleteSell.UserId } }
                ]
            },
            data:
            {
                deleted: true
            }
        })

        if (dataDeleteSell.AddExitTransaction){
            let AddExitTransactionDb = await prisma.transactions.create({data:{
                description: 'Estorno de Venda',
                type:'exit',
                value: dataDeleteSell.SellValue,
                sellId: dataDeleteSell.SellId,
                storeId: dataDeleteSell.UserId
            }})
        }

        if (deleteSellonDB.count <= 0) {
            response.json({Success: false, erro: "Nenhum registro encontrado com os parametros fornecidos"})
        } else {
            response.json({Success: true, deleteSellonDB})
        }
    }
    catch(error){

        response.json({Success:false, erro:error})

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
        return response.json({ valid: false, error_message: "Token Invalido", error })
    }

})


app.post("/products", async (request, response) => {

    const { userId } = request.body

    if (userId) {
        try {
            let listProducts = await prisma.products.findMany({
                where: { storeId: userId },
                select: { id: true, name: true, value: true ,created_at:true,active:true,quantity:true}
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
                        {storeId : datafindSells.userId},
                        {deleted : false}
                    
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
                        {storeId : datafindSells.userId},
                        {deleted : false}
                    
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
        let findtransactions = await prisma.transactions.findMany({
            where: { AND: [{
                storeId:datafindTransactions.userID,
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

app.post("/addtransaction", async(request,response) => {

    const {dataAddTransaction} = request.body

    try {
        let createPaymentTransaction = await prisma.transactions.create({ data: {
            type:dataAddTransaction.type,
            description: dataAddTransaction.description,
            value: dataAddTransaction.value,
            storeId: dataAddTransaction.UserId
        }})
        return response.json({Sucess:true})

    }catch (error) {

        return response.json({Sucess:false, Erro: error})

    }
})

// END TRANSACTIONS //

// START INVENTORY MANAGEMENT //

app.post("/addproduct", async(request,response) => {

        const {dataAddProduct} = request.body
        
        try {
            
            let addproduct = await prisma.products.create({data:{
                name:dataAddProduct.name,
                value:dataAddProduct.value,
                storeId:dataAddProduct.userId,
                quantity:dataAddProduct.quantity,
                active:dataAddProduct.active,
                

            }})

            let createTransactionProduct = await prisma.transactionsProducts.create({data:{
                type: "E",
                description:"Criação do produto",
                totalQuantity: dataAddProduct.quantity,
                quantity:dataAddProduct.quantity,
                productId:addproduct.id,
                storeId:dataAddProduct.userId
            }})
            return response.json({Sucess:true})
        }
        catch(error){
            return response.json({erro:error})
        }

})

app.post("/editproduct", async(request,response) => {

    const {dataEditProduct} = request.body
    try {
        let searchProduct = await prisma.products.findUnique({
            where:{id:dataEditProduct.id}
        })
        if (searchProduct.name===dataEditProduct.name && 
            searchProduct.quantity===dataEditProduct.quantity &&
            searchProduct.value===dataEditProduct.value &&
            searchProduct.active===dataEditProduct.active
            ) {
                return response.json({Sucess:false,Erro: 'Não há alterações para serem realizadas!'})
            }
        else {
            try {
                let editproduct = await prisma.products.update({
                    
                    where:{id:dataEditProduct.id},
        
                    data:{
                    name:dataEditProduct.name,
                    value:dataEditProduct.value,
                    quantity:dataEditProduct.quantity,
                    active:dataEditProduct.active
        
                    }
                })
                console.log('a', editproduct)
                if (searchProduct.quantity > editproduct.quantity) {
                    
                    let createTransactionEditProduct = await prisma.transactionsProducts.create({data:{
                        type: "S",
                        description:"Ajuste de estoque",
                        totalQuantity: editproduct.quantity,
                        quantity: searchProduct.quantity - dataEditProduct.quantity,
                        productId:dataEditProduct.id,
                        storeId:dataEditProduct.userId
                    }})
                }
                if (searchProduct.quantity < editproduct.quantity){
                    
                    let createTransactionEditProduct = await prisma.transactionsProducts.create({data:{
                        type: "E",
                        description:"Ajuste de estoque",
                        totalQuantity: editproduct.quantity,
                        quantity:dataEditProduct.quantity - searchProduct.quantity,
                        productId:dataEditProduct.id,
                        storeId:dataEditProduct.userId
                    }})
                }
                console.log(searchProduct,editproduct.quantity)
                return response.json({Sucess:true})
            }
            catch(error){
                return response.json({erro:error})
            }

        }
        
    }
    catch(error){
        return response.json({erro:error})

    }
})


app.post("/deleteproduct", async(request,response) => {

    const {dataDeleteProduct} = request.body
  

    try {
        let verifyIfExitsSellsThisProduct = await prisma.itensSell.findFirst({
            where:{idProduct:dataDeleteProduct.id}
        })
        if (verifyIfExitsSellsThisProduct){
            return response.json({Sucess:false,Erro: 'ERRO: Não é possivel excluir produtos que possuem vendas cadastradas!'})
        }
        
        else{
            let deleteTransationsProducts = await prisma.transactionsProducts.deleteMany({
                where:{productId:dataDeleteProduct.id}
            })

            console.log('aqui')

            let deleteproduct = await prisma.products.delete({
                where:{id:dataDeleteProduct.id} 
            })

            return response.json({Sucess:true})
        }
        
    }
    catch(error){
        return response.json({erro:error})
    }

})

app.post("/findtransactionsproducts", async(request,response) => {

    const {dataFindTransactionsProduct} = request.body
  

    try {
            let findTransactionsProducts = await prisma.transactionsProducts.findMany({where:{
                productId:dataFindTransactionsProduct.id
            }})
            return response.json({Sucess:true, findTransactionsProducts})
        }
    catch(error){
        return response.json({erro:error})
    }

})


// END INVENTORY MANAGEMENT //
app.listen(2211, () => console.log('Server Up on 2211 port'));