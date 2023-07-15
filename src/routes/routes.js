const { Router } = require('express');
const router = Router();
const { PrismaClient, Prisma } = require('@prisma/client');
const changePass = require('../factories/settings/changePass');
const prisma = new PrismaClient()
const findTransactions = require('../factories/transactions/findTransactions')(prisma);
const addTransaction = require('../factories/transactions/addTransaction')(prisma);
const addProduct = require('../factories/inventoryManagement/addProduct')(prisma);
const editProduct = require('../factories/inventoryManagement/editProduct')(prisma);
const deleteProduct = require('../factories/inventoryManagement/deleteProduct')(prisma);
const findTransactionsProducts = require('../factories/inventoryManagement/findTransactionsProducts')(prisma);
const findSellers = require('../factories/people/findSellers')(prisma);
const editSeller = require('../factories/people/editSeller')(prisma);
const addSeller = require('../factories/people/addSeller')(prisma);
const findClients = require('../factories/people/findClients')(prisma);
const editClient = require('../factories/people/editClient')(prisma);
const addClient = require('../factories/people/addClient')(prisma);
const deleteClient = require('../factories/people/deleteClient')(prisma);
const deleteSeller = require('../factories/people/deleteSeller')(prisma);
const aboutCorporation = require('../factories/settings/aboutCorporation')(prisma);
const changeAboutCorporation = require('../factories/settings/changeAboutCorporation')(prisma);
const listNcm = require('../factories/settings/listNcm')(prisma);
const listItemType = require('../factories/settings/listItemType')(prisma);
const addUser = require('../factories/login/addUser')(prisma);
const validateMail = require('../factories/login/validateMail')(prisma);
const logout = require('../factories/login/logout')(prisma);
const chartBar = require('../factories/home/chartBar')(prisma);
const chartDoughnut = require('../factories/home/chartDoughnut')(prisma);
const chartArea = require('../factories/home/chartArea')(prisma);
const chartBestSellers = require('../factories/home/chartBestSellers')(prisma);
const chartTopSellingProducts = require('../factories/home/chartTopSellingProducts')(prisma);
const chartRadar = require('../factories/home/chartRadar')(prisma);
const findCfop = require('../factories/inventoryManagement/findCfop')(prisma)
const signIn = require('../factories/login/signin')(prisma)
const validate = require('../factories/login/validate')(prisma)
const addSell = require('../factories/sells/addSell')(prisma);
const deleteSell = require('../factories/sells/deleteSell')(prisma);
const products = require('../factories/inventoryManagement/products')(prisma);
const findsSells = require('../factories/controlSells/findSells')(prisma);

//START LOGIN//
router.post("/signin", signIn)
router.post("/validate", validate)
router.post("/adduser", addUser)
router.post("/validatemail", validateMail)
router.post("/logout", logout)
// END LOGIN //

// START HOME //
router.post("/charts/bar", chartBar)
router.post("/charts/doughnut", chartDoughnut)
router.post('/charts/area', chartArea)
router.post("/charts/bestsellers", chartBestSellers)
router.post("/charts/topsellingproducts", chartTopSellingProducts)
router.post("/charts/radar", chartRadar)
// END HOME //

// START SELLS //
router.post("/addsell", addSell)
router.post("/deletesell", deleteSell)
// END SELLS //

// START CONTROL SELLS //
router.post("/findsells", findsSells)
// END CONTROL SELLS //

// START INVENTORYMANAGEMENT //
router.post("/products", products)
router.get("/listCfop", findCfop)
router.post("/addproduct", addProduct)
router.post("/editproduct", editProduct)
router.post("/deleteproduct", deleteProduct)
router.post("/findtransactionsproducts", findTransactionsProducts)
// END INVENTORYMANAGEMENT //

// START TRANSCTIONS // 
router.post("/findtransactions", findTransactions)
router.post("/addtransaction", addTransaction)
// END TRANSACTIONS //

// START PEOPLE //
router.post("/findsellers", findSellers)
router.post('/editseller', editSeller)
router.post('/addseller', addSeller)
router.post("/findclients", findClients)
router.post('/editclient', editClient)
router.post('/addclient', addClient)
router.post('/deleteclient', deleteClient)
router.post('/deleteseller', deleteSeller)
// END PEOPLE //

// START SETTINGS //
router.patch("/changepass", changePass)
router.get("/aboutCorporation", aboutCorporation)
router.patch("/changeAboutCorporation", changeAboutCorporation)
router.get("/listNCM", listNcm)
router.get("/listItemType", listItemType)
// END SETTINGS //

module.exports = router