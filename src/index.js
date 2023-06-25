const { PrismaClient, Prisma } = require('@prisma/client');
const express = require('express')
const { v4 } = require('uuid')
const bcrypt = require('bcrypt')
const prisma = new PrismaClient()
const app = express();
const cors = require('cors');
const req = require('express/lib/request');
const sendEmail = require('./mail')
const auth = require("./auth")
const atualdate = new Date()
const corsOptions = {
    //PRODUCTION:
    //origin: ['https://safyra.com.br','https://www.safya.com.br','https://*.safyra.com.br'],
    //DEVELOPMENT:
    origin: "*",
    optionsSucessStatus: 200
}


app.use(express.json())
app.use(cors())
app.use(cors(corsOptions))

app.use(auth()) // all routes below have authorization validation
//START LOGIN//
app.post("/signin", async (request, response) => {

    try {
        const { email, password } = request.body
        const uuidGenerated = v4()

        const updatetoken = await prisma.user.update({ where: { email: email }, data: { Token: uuidGenerated } })
        const validateUser = await prisma.user.findUnique({ where: { email: email } })

        if (validateUser === null) {
            return response.json({ erro: "Não foi encontrado usuarios com esse email" })
        }
        else {
            if (await bcrypt.compare(password, validateUser.password)) {
                return response.json({
                    user: {
                        id: validateUser.id,
                        name: validateUser.name,
                        email: validateUser.email,
                        masterkey: validateUser.masterkey,
                        isEmailValid: validateUser.isEmailValid,
                        codEmailValidate: validateUser.codEmailValidate
                    },
                    token: validateUser.Token
                })
            }
            else {
                return response.json({ Success: false, erro: "Senha incorreta" })
            }
        }


    } catch (error) {
        return response.json({ error_message: "Usuario não encontrado", error })
    }
})

app.post("/validate", async (request, response) => {
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
        return response.json({ valid: false, error_message: "Token Invalido", error })
    }

})

// END LOGIN //


app.post("/adduser", async (request, response) => {
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
        return response.json({ Success: false, erro: error.message })
    }
})

app.post("/validatemail", async (request, response) => {

    const { userId } = request.body
    console.log(userId)
    try {
        const validateMail = await prisma.user.update({
            where: {
                id: userId
            }, data: {
                codEmailValidate: null,
                isEmailValid: true
            }
        })
        if (validateMail) {
            return response.json({ success: true })

        } else {
            throw new Error('Falha ao validar e-mail')
        }

    } catch (error) {
        return response.json({ success: false, erro: error.message })
    }

})

app.post("/logout", async (request, response) => {

    const { userId } = request.body.dataLogOutUser
    const uuidGenerated = v4()

    try {
        const logoutUserDb = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                Token: uuidGenerated
            }
        })
        if (logoutUserDb) {
            return response.json({ Success: true })
        }
        else {
            return response.json({ Success: false, erro: 'Falha ao atualizar Token' })
        }
    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }
})

// START HOME //

app.post("/charts/bar", async (request, response) => {

    const { userId } = request.body

    try {
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const qtdMoths = [0, 1, 2, 3, 4, 5] // add to changing months quantity
        const monthstoConsult = qtdMoths.map(month => month = new Date().getMonth() + 1 - month)

        const dataBarChart = []

        await Promise.all(
            monthstoConsult.map(async monthConsult => {
                const year = monthConsult <= 0 ? atualYear - 1 : atualYear //update year last year
                const month = monthConsult <= 0 ? monthConsult + 12 : monthConsult //update months last year
                const initialDate = new Date(month > 9 ? `${year}-${month}-01T03:00:00.000Z` : `${year}-0${month}-01T03:00:00.000Z`)
                const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

                const VerifySells = await prisma.sells.findMany({
                    where: {
                        AND: [{
                            created_at: {
                                gt: initialDate
                            }
                        },
                        {
                            created_at: {
                                lt: finalDate
                            }
                        },
                        { storeId: userId },
                        { deleted: false }

                        ]
                    }
                })

                const sumSells = VerifySells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)
                const medTicket = VerifySells.length === 0 ? 0 : sumSells / VerifySells.length
                dataBarChart.push({ sumSells, month, medTicket, year, initialDate, finalDate })
                dataBarChart.sort(function (x, y) { return x.initialDate - y.initialDate }) //order array
            }))
        return response.json({ Success: true, dataBarChart })

    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }

})

app.post("/charts/doughnut", async (request, response) => {

    try {

        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

        const searchsells = await prisma.sells.findMany({
            where: {
                AND: [{
                    created_at: {
                        gt: initialDate
                    }
                },
                {
                    created_at: {
                        lt: finalDate
                    }
                },
                { storeId: userId },

                ]
            }
        })

        const GenderClients = []

        await Promise.all(

            searchsells.map(async sell => {

                if (sell.clientId === null) {
                    GenderClients.push({ gender: null })
                }
                else {
                    const searchGenderClients = await prisma.clients.findUnique({
                        where: {
                            id: sell.clientId
                        }, select: {
                            gender: true
                        }
                    })
                    GenderClients.push(searchGenderClients)
                }
            })
        )

        const FemaleGender = GenderClients.filter(client => client.gender === "F")
        const MasculineGender = GenderClients.filter(client => client.gender === "M")
        const NotInformedGender = GenderClients.filter(client => client.gender === null)

        return response.json({
            Success: true,
            doughnutData: {
                femaleGender: FemaleGender.length,
                masculineGender: MasculineGender.length,
                notInformedGender: NotInformedGender.length
            },
            GenderClients
        })
    }

    catch (error) {

        return response.json({ Success: error })

    }
})

app.post('/charts/area', async (request, response) => {

    const { userId } = request.body
    const atualDate = new Date()
    const firstDayWeek = atualDate.getDate() - atualDate.getDay() // first day this week
    const endDayWeek = firstDayWeek + 6
    const qtdDays = [0, 1, 2, 3, 4, 5, 6] // change to add more days
    const daysToConsult = qtdDays.map(day => firstDayWeek + day)

    //var primeiroDiaDaSemana = new Date(dataAtual.setDate(primeiro)).toUTCString();
    //var ultimoDiaDaSemana = new Date(dataAtual.setDate(ultimo)).toUTCString();

    const SellsChartArea = []

    await Promise.all(
        daysToConsult.map(async day => {

            const initialDayConsult = new Date((new Date()).setDate(day))
            const initialHourDayConsult = new Date(initialDayConsult.setUTCHours(0, 0, 0, 0))
            const endHourDayConsult = new Date(initialDayConsult.setUTCHours(23, 59, 59, 59))
            const nameDay = new Date((new Date()).setDate(day)).toLocaleString([], { weekday: 'long' })


            try {
                const Sells = await prisma.sells.findMany({
                    where: {
                        AND: [{
                            created_at: {
                                gt: initialHourDayConsult
                            }
                        },
                        {
                            created_at: {
                                lt: endHourDayConsult
                            }
                        },
                        { storeId: userId },

                        ]
                    }
                })

                const totalSells = Sells.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)
                SellsChartArea.push({ totalSells, day, nameDay })
                SellsChartArea.sort(function (x, y) { return x.day - y.day }) // order array
            }
            catch (error) {
                return response.json({ Success: false, erro: error })
            }


        })
    )
    return response.json({ Success: true, SellsChartArea })
})

app.post("/charts/bestsellers", async (request, response) => {

    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

        const Sellers =
            await prisma.sellers.findMany({
                where: {
                    storeId: userId
                },
                select: {
                    id: true,
                    name: true
                }
            })

        await Promise.all(
            Sellers.map(async seller => {
                const SellsSellers = await prisma.sells.findMany({
                    where: {
                        AND: [{
                            created_at: {
                                gt: initialDate
                            }
                        },
                        {
                            created_at: {
                                lt: finalDate
                            }
                        },
                        { storeId: userId },
                        { sellerId: seller.id }

                        ]
                    },
                    orderBy: {
                        sellerId: 'asc'
                    }
                })

                const totalValueSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.sellValue
                }, 0)

                await Promise.all(
                    SellsSellers.map(async sell => {
                        const ItensSellsSellers = await prisma.itensSell.findMany({
                            where: {
                                sellId: sell.id
                            }
                        })

                        sell.totalItens = ItensSellsSellers.length
                    })
                )

                const totalItensSell = SellsSellers.reduce((acc, item) => {
                    return acc + item.totalItens
                }, 0)

                seller.totalValueSell = totalValueSell
                seller.totalItensSell = totalItensSell
            })

        )

        const firstsSellers = Sellers.filter((value, index) => index <= 3)
        firstsSellers.sort(function (x, y) { return y.totalValueSell - x.totalValueSell }) // odernar array

        if (Sellers) {
            return response.json({ Success: true, bestSellers: firstsSellers })
        }
        else {
            return response.json({ Success: false, erro: "Falha ao localizar dados dos melhores vendedores!" })
        }
    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }
})

app.post("/charts/topsellingproducts", async (request, response) => {
    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)


        const topSellingProducts = await prisma.itensSell.groupBy({
            where: {
                AND: [{
                    created_at: {
                        gt: initialDate
                    }
                },
                {
                    created_at: {
                        lt: finalDate
                    }
                },
                { storeId: userId },
                ]
            },
            _sum: { quantity: true },
            by: ['idProduct'],
            orderBy: { _sum: { quantity: 'desc' } },
            take: 5
        })

        await Promise.all(
            topSellingProducts.map(async sell => {
                sell.quantity = sell._sum.quantity
                const findProducts = await prisma.products.findUnique({
                    where: { id: sell.idProduct }
                })
                sell.productName = findProducts.name
                delete sell._sum
            }
            )
        )
        return response.json({ Success: true, topSellingProducts })
    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }
})

app.post("/charts/radar", async (request, response) => {
    try {
        const { userId } = request.body
        const atualMonth = new Date().getMonth() + 1
        const atualYear = new Date().getFullYear()
        const initialDate = new Date(atualMonth > 9 ? `${atualYear}-${atualMonth}-01T03:00:00.000Z` : `${atualYear}-0${atualMonth}-01T03:00:00.000Z`)
        const finalDate = new Date(initialDate.getFullYear(), initialDate.getMonth() + 1, 0)

        const Payments = await prisma.paymentSell.groupBy({
            where: {
                AND: [{
                    created_at: {
                        gt: initialDate
                    }
                },
                {
                    created_at: {
                        lt: finalDate
                    }
                },
                { storeId: userId },
                ]
            },
            _count: { id: true },
            by: ['typepayment'],
            orderBy: { typepayment: 'desc' },
            take: 5
        })

        await Promise.all(
            Payments.map(payment => {
                if (payment.typepayment === 'money') { payment.typepayment = 'Dinheiro' }
                if (payment.typepayment === 'creditcard') { payment.typepayment = 'Crédito' }
                if (payment.typepayment === 'debitcard') { payment.typepayment = 'Débito' }
                if (payment.typepayment === 'pix') { payment.typepayment = 'Pix' }
                if (payment.typepayment === 'others') { payment.typepayment = 'Outros' }
                payment.quantity = payment._count.id
                delete payment._count
            })
        )

        return response.json({ Success: true, Payments })
    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }
})
// END HOME //

// START SELLS //

app.post("/addsell", async (request, response) => {
    try {
        const { sell } = request.body

        const createSellonDB = await prisma.sells.create({
            data: {
                storeId: sell.UserId,
                sellValue: sell.totalValue,
                valuePayment: sell.valuePayment,
                clientId: sell.clientId,
                sellerId: sell.sellerId

            }
        })

        await sell.Products.map(async (product) => {

            const searchProduct = await prisma.products.findUnique({
                where: {
                    id: product.id
                }
            })
            if (product.quantity > searchProduct.quantity) {
                return ('quantidade maior do que o saldo')

            } else {
                const updateQuantityProduct = await prisma.products.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        quantity: searchProduct.quantity - product.quantity
                    }

                })
                const createTransactionProduct = await prisma.transactionsProducts.create({
                    data: {
                        type: "S",
                        description: "Venda",
                        totalQuantity: searchProduct.quantity - product.quantity,
                        quantity: product.quantity,
                        productId: searchProduct.id,
                        storeId: searchProduct.storeId
                    }
                })
            }
        })


        await sell.Products.map(async (product) => {
            const createItensSellonDB = await prisma.itensSell.create({
                data: {
                    storeId: sell.UserId,
                    sellId: createSellonDB.id,
                    idProduct: product.id,
                    quantity: product.quantity,
                    valueProduct: product.initialvalue,
                    totalValue: product.totalvalue,
                    descriptionProduct: product.name
                }
            });
            console.log("Created Products", atualdate)
        })

        await sell.Payment.map(async (payment) => {
            const createPaymentSellonDB = await prisma.paymentSell.create({
                data: {
                    storeId: sell.UserId,
                    sellId: createSellonDB.id,
                    typepayment: payment.type,
                    value: payment.value
                }
            });
            console.log("Created Payment", atualdate)
            const createPaymentTransaction = await prisma.transactions.create({
                data: {
                    type: payment.type,
                    description: "Recebimento de venda",
                    value: payment.value,
                    sellId: createSellonDB.id,
                    storeId: sell.UserId
                }
            })
        })
        return response.json({ Success: true })
    }

    catch (error) {
        return response.json({ Success: false, Erro: error })
    }
})

app.post("/deletesell", async (request, response) => {

    const { dataDeleteSell } = request.body

    try {

        dataDeleteSell.Products.map(async product => {
            const searchProduct = await prisma.products.findUnique({
                where: {
                    id: product.idProduct
                }
            })
            const updateQntProduct = await prisma.products.update({
                where: {
                    id: searchProduct.id
                },
                data: {
                    quantity: searchProduct.quantity + product.quantity
                }
            })
            const addTransaction = await prisma.transactionsProducts.create({
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


        const deleteSellonDB = await prisma.sells.updateMany({

            where:
            {
                AND: [
                    { id: dataDeleteSell.SellId },
                    { storeId: dataDeleteSell.UserId }
                ]
            },

            data:
            {
                deleted: true
            }

        })

        const deleteItensSellonDB = await prisma.itensSell.updateMany({
            where:
            {
                AND: [
                    { sellId: dataDeleteSell.SellId },
                    { storeId: dataDeleteSell.UserId }
                ]
            },
            data:
            {
                deleted: true
            }
        })

        if (dataDeleteSell.AddExitTransaction) {
            const AddExitTransactionDb = await prisma.transactions.create({
                data: {
                    description: 'Estorno de Venda',
                    type: 'exit',
                    value: dataDeleteSell.SellValue,
                    sellId: dataDeleteSell.SellId,
                    storeId: dataDeleteSell.UserId
                }
            })
        }

        if (deleteSellonDB.count <= 0) {
            response.json({ Success: false, erro: "Nenhum registro encontrado com os parametros fornecidos" })
        } else {
            response.json({ Success: true, deleteSellonDB })
        }
    }
    catch (error) {

        response.json({ Success: false, erro: error })

    }
})


app.post("/products", async (request, response) => {

    const { userId } = request.body

    if (userId) {
        try {
            const listProducts = await prisma.products.findMany({
                orderBy: { id: 'desc' },
                where: { storeId: userId },
                select: { id: true, name: true, value: true, created_at: true, active: true, quantity: true }
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

app.post("/findsells", async (request, response) => {
    const { datafindSells } = request.body

    try {
        const findsells = await prisma.sells.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    created_at: {
                        gt: new Date(datafindSells.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindSells.userId },
                { deleted: false }

                ]
            }
        })

        const findsellsproducts = await prisma.itensSell.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    created_at: {
                        gt: new Date(datafindSells.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindSells.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindSells.userId },
                { deleted: false }

                ]
            }
        })

        let finalSellswithSellerorClientname = []

        await Promise.all(
            findsells.map(async (sell) => {
                if (sell.sellerId || sell.clientId) {
                    if (sell.sellerId && sell.clientId) {
                        const findSellersName = await prisma.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {

                                name: true
                            }
                        });

                        const findClientName = await prisma.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });

                        finalSellswithSellerorClientname.push({
                            clientName: findClientName.name,
                            sellerName: findSellersName.name,
                            ...sell
                        })
                    }
                    else if (sell.sellerId) {
                        const findSellersName = await prisma.sellers.findUnique({
                            where: {
                                id: sell.sellerId
                            },
                            select: {

                                name: true
                            }
                        });
                        finalSellswithSellerorClientname.push({
                            sellerName: findSellersName.name,
                            ...sell
                        })
                    }
                    else if (sell.clientId) {
                        const findClientName = await prisma.clients.findUnique({
                            where: {
                                id: sell.clientId
                            },
                            select: {
                                name: true
                            }
                        });
                        finalSellswithSellerorClientname.push({
                            clientName: findClientName.name,
                            ...sell
                        })
                    }


                }
                else {
                    finalSellswithSellerorClientname.push({ ...sell })
                }
            })
        )
        console.log(finalSellswithSellerorClientname)
        //const findsells = await prisma.$queryRaw`SELECT * FROM "public"."ItensSell" WHERE "created_at" = timestamp '2022-06-09 13:27:54' `

        if (findsells && findsellsproducts && finalSellswithSellerorClientname) {
            const finalreturn = { sells: [...finalSellswithSellerorClientname], sellsproducts: [...findsellsproducts] }
            return response.json(finalreturn)
        }
    }
    catch (error) {
        return response.json({ erro: error })
    }
})


// END CONTROL SELLS //

// START TRANSCTIONS // 
app.post("/findtransactions", async (request, response) => {

    const { datafindTransactions } = request.body
    try {
        const findtransactions = await prisma.transactions.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND: [{
                    storeId: datafindTransactions.userID,
                    created_at: {
                        gt: new Date(datafindTransactions.InitialDate)
                    }
                },
                {
                    created_at: {
                        lt: new Date(`${datafindTransactions.FinalDate}T23:59:59Z`)
                    }
                },
                { storeId: datafindTransactions.userId }

                ]
            }
        })

        return response.json(findtransactions)
    }
    catch (error) {
        return response.json({ erro: error })

    }

})

app.post("/addtransaction", async (request, response) => {

    const { dataAddTransaction } = request.body

    try {
        const createPaymentTransaction = await prisma.transactions.create({
            data: {
                type: dataAddTransaction.type,
                description: dataAddTransaction.description,
                value: dataAddTransaction.value,
                storeId: dataAddTransaction.UserId
            }
        })
        return response.json({ Sucess: true })

    } catch (error) {

        return response.json({ Sucess: false, Erro: error })

    }
})

// END TRANSACTIONS //

// START INVENTORY MANAGEMENT //

app.post("/addproduct", async (request, response) => {

    const { dataAddProduct } = request.body

    try {

        const addproduct = await prisma.products.create({
            data: {
                name: dataAddProduct.name,
                value: dataAddProduct.value,
                storeId: dataAddProduct.userId,
                quantity: dataAddProduct.quantity,
                active: dataAddProduct.active,


            }
        })

        const createTransactionProduct = await prisma.transactionsProducts.create({
            data: {
                type: "E",
                description: "Criação do produto",
                totalQuantity: dataAddProduct.quantity,
                quantity: dataAddProduct.quantity,
                productId: addproduct.id,
                storeId: dataAddProduct.userId
            }
        })
        return response.json({ Sucess: true })
    }
    catch (error) {
        return response.json({ erro: error })
    }

})

app.post("/editproduct", async (request, response) => {

    const { dataEditProduct } = request.body
    try {
        const searchProduct = await prisma.products.findUnique({
            where: { id: dataEditProduct.id }
        })

        if (searchProduct.name === dataEditProduct.name &&
            searchProduct.quantity === dataEditProduct.quantity &&
            searchProduct.value === dataEditProduct.value &&
            searchProduct.active === dataEditProduct.active
        ) {
            return response.json({ Sucess: false, erro: 'Não há alterações para serem realizadas!' })
        }
        else {
            try {
                const editproduct = await prisma.products.updateMany({

                    where: {
                        AND: [
                            { id: dataEditProduct.id },
                            { storeId: dataEditProduct.userId }
                        ]
                    },

                    data: {
                        name: dataEditProduct.name,
                        value: dataEditProduct.value,
                        quantity: dataEditProduct.quantity,
                        active: dataEditProduct.active

                    }
                })


                if (editproduct.count <= 0) {
                    return response.json({
                        Sucess: false, erro: "Nenhum registro encontrado com as codições informadas"
                    })
                }
                else {
                    if (searchProduct.quantity > dataEditProduct.quantity) {

                        try {
                            const createTransactionEditProduct = await prisma.transactionsProducts.create({
                                data: {
                                    type: "S",
                                    description: "Ajuste de estoque",
                                    totalQuantity: dataEditProduct.quantity,
                                    quantity: searchProduct.quantity - dataEditProduct.quantity,
                                    productId: dataEditProduct.id,
                                    storeId: dataEditProduct.userId
                                }
                            })
                            if (createTransactionEditProduct && editproduct) {
                                return response.json({
                                    Sucess: true
                                })
                            }
                        }
                        catch (error) {
                            return response.json({ Sucess: false, erro: error, message: "falha ao criar transação >" })
                        }

                    }
                    if (searchProduct.quantity < dataEditProduct.quantity) {

                        try {
                            const createTransactionEditProduct = await prisma.transactionsProducts.create({
                                data: {
                                    type: "E",
                                    description: "Ajuste de estoque",
                                    totalQuantity: dataEditProduct.quantity,
                                    quantity: dataEditProduct.quantity - searchProduct.quantity,
                                    productId: dataEditProduct.id,
                                    storeId: dataEditProduct.userId
                                }
                            })
                            if (createTransactionEditProduct && editproduct) {
                                return response.json({
                                    Sucess: true
                                })
                            }
                        }
                        catch (error) {
                            return response.json({ Sucess: false, erro: error, message: "Falha ao criar transação <" })
                        }

                    }
                    if (searchProduct.quantity === dataEditProduct.quantity) {
                        if (editproduct.count > 0) {
                            return response.json({
                                Sucess: true
                            })
                        }

                    }
                }
            }
            catch (error) {
                return response.json({ Sucess: false, erro: error, message: "Falha ao editar produto" })
            }
        }
    }
    catch (error) {
        return response.json({ Sucess: false, erro: error, message: "Falha ao localizar produto" })
    }

}
)


app.post("/deleteproduct", async (request, response) => {

    const { dataDeleteProduct } = request.body


    try {
        const verifyIfExitsSellsThisProduct = await prisma.itensSell.findFirst({
            where: { idProduct: dataDeleteProduct.id }
        })
        if (verifyIfExitsSellsThisProduct) {
            return response.json({ Sucess: false, Erro: 'ERRO: Não é possivel excluir produtos que possuem vendas cadastradas!' })
        }

        else {
            const deleteTransationsProducts = await prisma.transactionsProducts.deleteMany({
                where: {
                    AND: [
                        { productId: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            const deleteproduct = await prisma.products.deleteMany({
                where: {
                    AND: [
                        { id: dataDeleteProduct.id },
                        { storeId: dataDeleteProduct.storeId }
                    ]
                }
            })

            if (deleteTransationsProducts && deleteproduct) {
                return response.json({ Sucess: true })
            }
        }

    }
    catch (error) {
        return response.json({ erro: error })
    }

})

app.post("/findtransactionsproducts", async (request, response) => {

    const { dataFindTransactionsProduct } = request.body


    try {
        const findTransactionsProducts = await prisma.transactionsProducts.findMany({
            orderBy: { id: 'desc' },
            where: {
                AND:
                    [
                        { productId: dataFindTransactionsProduct.id },
                        { storeId: dataFindTransactionsProduct.storeId }
                    ]
            }
        })
        return response.json({ Sucess: true, findTransactionsProducts })
    }
    catch (error) {
        return response.json({ erro: error })
    }

})

app.post("/findsellers", async (request, response) => {

    const { userId } = request.body

    if (userId) {
        try {
            const findSellers = await prisma.sellers.findMany({
                orderBy: { name: 'asc' },
                where: {
                    storeId: userId
                }
            })
            // if (findSellers.length === 0) {
            //     return response.json({ Success: false, erro: "ERRO: Nenhum vendedor encontrado com os dados fornecidos!" })
            // }
            // else {
            return response.json({ Success: true, findSellers })
            // }
        }
        catch (error) {
            return response.json({ Sucess: false, erro: error })
        }
    }
    else {
        return response.json({ Sucess: false, erro: "Dados invalidos, informe corretamente !" })
    }
})

app.post('/editseller', async (request, response) => {

    const { dataEditSeller } = request.body

    if (dataEditSeller) {
        try {
            const editSeller = await prisma.sellers.updateMany({
                where: {
                    AND: [
                        { id: dataEditSeller.idSeller },
                        { storeId: dataEditSeller.storeId }
                    ]
                },
                data: {
                    email: dataEditSeller.email,
                    adressCep: dataEditSeller.adressCep,
                    adressCity: dataEditSeller.adressCity,
                    adressComplement: dataEditSeller.adressComplement,
                    adressNeighborhood: dataEditSeller.adressNeighborhood,
                    adressNumber: dataEditSeller.adressNumber,
                    adressState: dataEditSeller.adressState,
                    adressStreet: dataEditSeller.adressStreet,
                    birthDate: dataEditSeller.birthDate,
                    cellNumber: dataEditSeller.cellNumber,
                    cpf: dataEditSeller.cpf,
                    gender: dataEditSeller.gender,
                    name: dataEditSeller.name,
                    phoneNumber: dataEditSeller.phoneNumber,
                    active: dataEditSeller.active
                }
            })
            if (editSeller) {
                return response.json({ Success: true, dataSeller: editSeller })
            }
        }
        catch (error) {
            return response.json({ Success: false, erro: error })
        }
    }
    else {
        return response.json({ Success: false, erro: "Dados invalidos, informe corretamente !" })
    }
})

app.post('/addseller', async (request, response) => {

    const { dataAddSeller } = request.body

    if (dataAddSeller) {
        try {
            const addSeller = await prisma.sellers.create({
                data: {
                    email: dataAddSeller.email,
                    adressCep: dataAddSeller.adressCep,
                    adressCity: dataAddSeller.adressCity,
                    active: dataAddSeller.active,
                    adressComplement: dataAddSeller.adressComplement,
                    adressNeighborhood: dataAddSeller.adressNeighborhood,
                    adressNumber: dataAddSeller.adressNumber,
                    adressState: dataAddSeller.adressState,
                    adressStreet: dataAddSeller.adressStreet,
                    birthDate: dataAddSeller.birthDate,
                    cellNumber: dataAddSeller.cellNumber,
                    cpf: dataAddSeller.cpf,
                    gender: dataAddSeller.gender,
                    name: dataAddSeller.name,
                    phoneNumber: dataAddSeller.phoneNumber,
                    storeId: dataAddSeller.storeId,
                }
            })
            if (addSeller) {
                return response.json({ Success: true, dataSeller: addSeller })
            }
        }
        catch (error) {
            return response.json({ Success: false, erro: error })
        }
    }
    else {
        return response.json({ Success: false, erro: "Dados invalidos, informe corretamente !" })
    }
})

app.post("/findclients", async (request, response) => {

    const { userId } = request.body

    if (userId) {
        try {
            const findClients = await prisma.clients.findMany({
                orderBy: {
                    name: 'asc'
                },
                where: {
                    storeId: userId
                }
            })
            // if (findClients.length === 0) {
            //     return response.json({ Success: false, erro: "ERRO: Nenhum cliente encontrado com os dados fornecidos!" })
            // }
            // else {
            return response.json({ Success: true, findClients })
            // }
        }
        catch (error) {
            return response.json({ Sucess: false, erro: error })
        }
    }
    else {
        return response.json({ Sucess: false, erro: "Dados invalidos, informe corretamente !" })
    }
})

app.post('/editclient', async (request, response) => {

    const { dataEditClient } = request.body

    if (dataEditClient) {
        try {
            const editClient = await prisma.clients.updateMany({
                where: {
                    AND:
                        [
                            { id: dataEditClient.idClient },
                            { storeId: dataEditClient.storeId }
                        ]
                },
                data: {
                    email: dataEditClient.email,
                    adressCep: dataEditClient.adressCep,
                    adressCity: dataEditClient.adressCity,
                    adressComplement: dataEditClient.adressComplement,
                    adressNeighborhood: dataEditClient.adressNeighborhood,
                    adressNumber: dataEditClient.adressNumber,
                    adressState: dataEditClient.adressState,
                    adressStreet: dataEditClient.adressStreet,
                    birthDate: dataEditClient.birthDate,
                    cellNumber: dataEditClient.cellNumber,
                    cpf: dataEditClient.cpf,
                    gender: dataEditClient.gender,
                    name: dataEditClient.name,
                    phoneNumber: dataEditClient.phoneNumber,

                }
            })
            if (editClient) {
                return response.json({ Success: true, dataClient: editClient })
            }
        }
        catch (error) {
            return response.json({ Success: false, erro: error })
        }
    }
    else {
        return response.json({ Success: false, erro: "Dados invalidos, informe corretamente !" })
    }
})


app.post('/addclient', async (request, response) => {

    const { dataAddClient } = request.body

    if (dataAddClient) {
        try {
            const addClient = await prisma.clients.create({
                data: {
                    email: dataAddClient.email,
                    adressCep: dataAddClient.adressCep,
                    adressCity: dataAddClient.adressCity,
                    active: dataAddClient.active,
                    adressComplement: dataAddClient.adressComplement,
                    adressNeighborhood: dataAddClient.adressNeighborhood,
                    adressNumber: dataAddClient.adressNumber,
                    adressState: dataAddClient.adressState,
                    adressStreet: dataAddClient.adressStreet,
                    birthDate: dataAddClient.birthDate,
                    cellNumber: dataAddClient.cellNumber,
                    cpf: dataAddClient.cpf,
                    gender: dataAddClient.gender,
                    name: dataAddClient.name,
                    phoneNumber: dataAddClient.phoneNumber,
                    storeId: dataAddClient.storeId,
                }
            })
            if (addClient) {
                return response.json({ Success: true, dataClient: addClient })
            }
        }
        catch (error) {
            return response.json({ Success: false, erro: error })
        }
    }
    else {
        return response.json({ Success: false, erro: "Dados invalidos, informe corretamente !" })
    }
})

app.post('/deleteclient', async (request, response) => {

    const { dataDeleteClient } = request.body

    try {
        const deleteClientDb = await prisma.clients.deleteMany({
            where: {
                AND: [{
                    storeId: dataDeleteClient.userId,
                    id: dataDeleteClient.clientId
                }]
            }
        })
        if (deleteClientDb.count <= 0) {
            return response.json({ Success: false, erro: "Nenhum registro encontrado" })
        }
        else if (deleteClientDb.count > 0) {
            return response.json({ Success: true })
        }
    }
    catch (error) {
        return response.json({ Success: false, erro: error })
    }

})

app.post('/deleteseller', async (request, response) => {

    const { dataDeleteSeller } = request.body

    try {
        const deleteSellerDb = await prisma.sellers.deleteMany({
            where: {
                AND: [
                    { id: dataDeleteSeller.sellerId },
                    { storeId: dataDeleteSeller.userId }
                ]
            }
        })
        if (deleteSellerDb.count > 0) {
            return response.json({ Success: true })
        }
        else if (deleteSellerDb.count <= 0) {
            return response.sjon({ Success: false, erro: 'Nenhum registro encontrado com os parametros fonecidos' })
        }
    }
    catch (error) {

        return response.json({ Success: false, erro: error })

    }
})

// END INVENTORY MANAGEMENT //

// START SETTINGS //

app.patch("/changepass", async (request, response) => {
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
        return response.json({ Success: false, erro: error.message })
    }
})

app.get("/aboutCorporation", async (request, response) => {
    try {
        const { storeId } = request.query
        if (!storeId) {
            throw new Error('Informe o storeId!')
        }

        const resultAboutCorporation = await prisma.user.findUnique({
            where: {
                id: parseInt(storeId)
            }, select: {
                email: true,
                name: true,
                phone: true,
                adressCep: true,
                adressNeighborhood: true,
                adressNumber: true,
                adressState: true,
                adressStreet: true,
                adressCity: true,
                cellPhone: true,
                fantasyName:true,
                cnpj: true
            }
        })
        if (!resultAboutCorporation) {
            throw new Error('Falha ao localizar dados sobre a empresa!')
        }
        return response.json({ Success: true, resultAboutCorporation })
    } catch (error) {
        return response.json({ Success: false, erro: error.message })
    }
})

app.patch("/changeAboutCorporation", async (request, response) => {
    try {
        const { storeId, name, phone, adressCep, adressNeighborhood, adressNumber, adressState, fantasyName,adressStreet, adressCity, cellPhone, cnpj } = request.body.data
        const updateAbouteCorporation = await prisma.user.update({
            where: {
                id: storeId
            }, data: {
                adressCep,
                adressNeighborhood,
                adressNumber,
                adressState,
                adressStreet,
                adressCity,
                cellPhone,
                cnpj,
                //email,
                fantasyName,
                name,
                phone
            }
        })
        if (!updateAbouteCorporation) {
            throw new Error('Falha ao atualizar dados sobre a empresa!')
        }
        return response.json({ Success: true, updateAbouteCorporation })
    } catch (error) {
        return response.json({ Success: false, erro: error.message })
    }
})
// END SETTINGS //
app.listen(2211, () => console.log('Server Up on 2211 port'));