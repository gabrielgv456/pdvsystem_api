//@ts-check

import { Router } from 'express';
const router = Router();
import changePass from '../factories/settings/changePass.js';
import findTransactions from '../factories/transactions/findTransactions.js';
import addTransaction from '../factories/transactions/addTransaction.js';
import addProduct from '../factories/inventoryManagement/addProduct.js';
import editProduct from '../factories/inventoryManagement/editProduct.js';
import deleteProduct from '../factories/inventoryManagement/deleteProduct.js';
import findTransactionsProducts from '../factories/inventoryManagement/findTransactionsProducts.js';
import findSellers from '../factories/people/findSellers.js';
import editSeller from '../factories/people/editSeller.js';
import addSeller from '../factories/people/addSeller.js';
import findClients from '../factories/people/findClients.js';
import editClient from '../factories/people/editClient.js';
import addClient from '../factories/people/addClient.js';
import deleteClient from '../factories/people/deleteClient.js';
import deleteSeller from '../factories/people/deleteSeller.js';
import aboutCorporation from '../factories/settings/aboutCorporation.js';
import changeAboutCorporation from '../factories/settings/changeAboutCorporation.js';
import listNcm from '../factories/settings/listNcm.js';
import listItemType from '../factories/settings/listItemType.js';
import addUser from '../factories/login/addUser.js';
import validateMail from '../factories/login/validateMail.js';
import logout from '../factories/login/logout.js';
import chartBar from '../factories/home/chartBar.js';
import chartDoughnut from '../factories/home/chartDoughnut.js';
import chartArea from '../factories/home/chartArea.js';
import chartBestSellers from '../factories/home/chartBestSellers.js';
import chartTopSellingProducts from '../factories/home/chartTopSellingProducts.js';
import chartRadar from '../factories/home/chartRadar.js';
import findCfop from '../factories/inventoryManagement/findCfop.js';
import signIn from '../factories/login/sign.js';
import validate from '../factories/login/validate.js';
import addSell from '../factories/sells/addSell.js';
import deleteSell from '../factories/sells/deleteSell.js';
import products from '../factories/inventoryManagement/products.js';
import findsSells from '../factories/controlSells/findSells.js';
import findDeliveries from '../factories/deliveries/findDeliveries.js';
import changeStatusDeliveries from '../factories/deliveries/changeStatusDeliveries.js';
import editAddressDelivery from '../factories/deliveries/editAddressDelivery.js';
import setPaymentsonDelivery from '../factories/deliveries/setPaymentsonDelivery.js';
import multer from '../factories/files/uploadMulter.js';
import deleteLogo from '../factories/settings/deleteLogo.js';
import validateForgotPassword from '../factories/login/validateForgotPassword.js';
import changeForgotPassword from '../factories/login/changeForgotPassword.js';
import verifyCodeForgotPassword from '../factories/login/verifyCodeForgotPassword.js';
import fiscalParameters from '../factories/settings/fiscalParameters/fiscalParameters.js';
import changeFiscalParameters from '../factories/settings/fiscalParameters/changeFiscalParameters.js';
import findIcmsOptions from '../factories/inventoryManagement/findIcmsOptions.js';
import uploadproductImage from '../factories/inventoryManagement/uploadProductImage.js';
import uploadFile from '../factories/files/uploadFile.js';
import { deleteFile } from '../factories/files/deleteFile.js';
import productsToSell from '../factories/sells/productsToSell.js';

//START LOGIN//
router.post("/signIn", signIn)
router.post("/validate", validate)
router.post("/adduser", addUser)
router.post("/validatemail", validateMail)
router.post("/logout", logout)
router.post("/validateForgotPassword", validateForgotPassword)
router.post("/changeForgotPassword", changeForgotPassword)
router.get("/verifyCodeForgotPassword", verifyCodeForgotPassword)
// END LOGIN

// START HOME
router.get("/charts/bar", chartBar)
router.get("/charts/doughnut", chartDoughnut)
router.get('/charts/area', chartArea)
router.get("/charts/bestsellers", chartBestSellers)
router.get("/charts/topsellingproducts", chartTopSellingProducts)
router.get("/charts/radar", chartRadar)
// END HOME

// START SELLS
router.post("/addsell", addSell)
router.post("/deletesell", deleteSell)
router.get("/productsToSell", productsToSell)
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
router.get("/products", products)
router.get("/listCfop", findCfop)
router.post("/addproduct", addProduct)
router.post("/editproduct", editProduct)
router.post("/deleteproduct", deleteProduct)
router.post("/findtransactionsproducts", findTransactionsProducts)
router.get("/findIcmsOptions", findIcmsOptions)
router.post("/uploadproductImage", multer.single('file'), uploadproductImage)
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
router.post("/uploadfile", multer.single('file'), uploadFile)
router.delete("/deleteFile", deleteFile)
router.get("/aboutCorporation", aboutCorporation)
router.patch("/changeAboutCorporation", changeAboutCorporation)
router.get("/listNCM", listNcm)
router.get("/listItemType", listItemType)
router.delete("/deleteLogo", deleteLogo)
router.get("/fiscalParameters", fiscalParameters)
router.post("/changeFiscalParameters", changeFiscalParameters)
// END SETTINGS

router.delete("/deleteFile/:fileName",)


export default router