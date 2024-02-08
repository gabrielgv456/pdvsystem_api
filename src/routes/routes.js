const { Router } = require('express');
const router = Router();
const changePass = require('../factories/settings/changePass');
const findTransactions = require('../factories/transactions/findTransactions');
const addTransaction = require('../factories/transactions/addTransaction');
const addProduct = require('../factories/inventoryManagement/addProduct');
const editProduct = require('../factories/inventoryManagement/editProduct');
const deleteProduct = require('../factories/inventoryManagement/deleteProduct');
const findTransactionsProducts = require('../factories/inventoryManagement/findTransactionsProducts');
const findSellers = require('../factories/people/findSellers');
const editSeller = require('../factories/people/editSeller');
const addSeller = require('../factories/people/addSeller');
const findClients = require('../factories/people/findClients');
const editClient = require('../factories/people/editClient');
const addClient = require('../factories/people/addClient');
const deleteClient = require('../factories/people/deleteClient');
const deleteSeller = require('../factories/people/deleteSeller');
const aboutCorporation = require('../factories/settings/aboutCorporation');
const changeAboutCorporation = require('../factories/settings/changeAboutCorporation');
const listNcm = require('../factories/settings/listNcm');
const listItemType = require('../factories/settings/listItemType');
const addUser = require('../factories/login/addUser');
const validateMail = require('../factories/login/validateMail');
const logout = require('../factories/login/logout');
const chartBar = require('../factories/home/chartBar');
const chartDoughnut = require('../factories/home/chartDoughnut');
const chartArea = require('../factories/home/chartArea');
const chartBestSellers = require('../factories/home/chartBestSellers');
const chartTopSellingProducts = require('../factories/home/chartTopSellingProducts');
const chartRadar = require('../factories/home/chartRadar');
const findCfop = require('../factories/inventoryManagement/findCfop')
const signIn = require('../factories/login/sign')
const validate = require('../factories/login/validate')
const addSell = require('../factories/sells/addSell');
const deleteSell = require('../factories/sells/deleteSell');
const products = require('../factories/inventoryManagement/products');
const findsSells = require('../factories/controlSells/findSells');
const findDeliveries = require('../factories/deliveries/findDeliveries');
const changeStatusDeliveries = require('../factories/deliveries/changeStatusDeliveries');
const editAddressDelivery = require('../factories/deliveries/editAddressDelivery');
const setPaymentsonDelivery = require('../factories/deliveries/setPaymentsonDelivery');
const uploadFile = require('../factories/settings/uploadFile');
const uploadMulter = require('../factories/files/uploadMulter');
const deleteLogo = require('../factories/settings/deleteLogo');
const validateForgotPassword = require('../factories/login/validateForgotPassword');
const changeForgotPassword = require('../factories/login/changeForgotPassword');
const verifyCodeForgotPassword = require('../factories/login/verifyCodeForgotPassword');
const fiscalParameters = require('../factories/settings/fiscalParameters/fiscalParameters');
const changeFiscalParameters = require('../factories/settings/fiscalParameters/changeFiscalParameters');

//START LOGIN//
router.post("/signIn", signIn)
router.post("/validate", validate)
router.post("/adduser", addUser)
router.post("/validatemail", validateMail)
router.post("/logout", logout)
router.post("/validateForgotPassword",validateForgotPassword)
router.post("/changeForgotPassword",changeForgotPassword)
router.get("/verifyCodeForgotPassword",verifyCodeForgotPassword)
// END LOGIN

// START HOME
router.post("/charts/bar", chartBar)
router.post("/charts/doughnut", chartDoughnut)
router.post('/charts/area', chartArea)
router.post("/charts/bestsellers", chartBestSellers)
router.post("/charts/topsellingproducts", chartTopSellingProducts)
router.post("/charts/radar", chartRadar)
// END HOME

// START SELLS
router.post("/addsell", addSell)
router.post("/deletesell", deleteSell)
// END SELLS

// START CONTROL SELLS
router.post("/findsells", findsSells)
// END CONTROL SELLS

// START DELIVERIES
router.get("/deliveries", findDeliveries)
router.patch("/changeStatusDeliveries", changeStatusDeliveries)
router.patch("/changeAddressDelivery", editAddressDelivery)
router.post("/setPaymentonDelivery", setPaymentsonDelivery)
// END DELIVERIES

// START INVENTORYMANAGEMENT
router.post("/products", products)
router.get("/listCfop", findCfop)
router.post("/addproduct", addProduct)
router.post("/editproduct", editProduct)
router.post("/deleteproduct", deleteProduct)
router.post("/findtransactionsproducts", findTransactionsProducts)
// END INVENTORYMANAGEMENT

// START TRANSCTIONS 
router.post("/findtransactions", findTransactions)
router.post("/addtransaction", addTransaction)
// END TRANSACTIONS

// START PEOPLE
router.post("/findsellers", findSellers)
router.post('/editseller', editSeller)
router.post('/addseller', addSeller)
router.post("/findclients", findClients)
router.post('/editclient', editClient)
router.post('/addclient', addClient)
router.post('/deleteclient', deleteClient)
router.post('/deleteseller', deleteSeller)
// END PEOPLE

// START SETTINGS
router.patch("/changepass", changePass)
router.post("/uploadfile", uploadMulter.single('file'), uploadFile)
router.get("/aboutCorporation", aboutCorporation)
router.patch("/changeAboutCorporation", changeAboutCorporation)
router.get("/listNCM", listNcm)
router.get("/listItemType", listItemType)
router.delete("/deleteLogo",deleteLogo)
router.get("/fiscalParameters", fiscalParameters)
router.post("/changeFiscalParameters",changeFiscalParameters)
// END SETTINGS


module.exports = router