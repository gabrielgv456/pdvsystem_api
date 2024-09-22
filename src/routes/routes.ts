//@ts-check

import { Router } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import changePass from '../factories/settings/changePass';
import findTransactions from '../factories/transactions/findTransactions';
import addTransaction from '../factories/transactions/addTransaction';
import addProduct from '../factories/inventoryManagement/addProduct';
import editProduct from '../factories/inventoryManagement/editProduct';
import deleteProduct from '../factories/inventoryManagement/deleteProduct';
import findTransactionsProducts from '../factories/inventoryManagement/findTransactionsProducts';
import findSellers from '../factories/people/findSellers';
import editSeller from '../factories/people/editSeller';
import addSeller from '../factories/people/addSeller';
import findClients from '../factories/people/findClients';
import editClient from '../factories/people/editClient';
import addClient from '../factories/people/addClient';
import deleteClient from '../factories/people/deleteClient';
import deleteSeller from '../factories/people/deleteSeller';
import aboutCorporation from '../factories/settings/aboutCorporation';
import changeAboutCorporation from '../factories/settings/changeAboutCorporation';
import listNcm from '../factories/settings/listNcm';
import listItemType from '../factories/settings/listItemType';
import addUser from '../factories/login/addUser';
import validateMail from '../factories/login/validateMail';
import logout from '../factories/login/logout';
import chartBar from '../factories/home/chartBar';
import chartDoughnut from '../factories/home/chartDoughnut';
import chartArea from '../factories/home/chartArea';
import chartBestSellers from '../factories/home/chartBestSellers';
import chartTopSellingProducts from '../factories/home/chartTopSellingProducts';
import chartRadar from '../factories/home/chartRadar';
import findCfop from '../factories/inventoryManagement/findCfop';
import signIn from '../factories/login/sign';
import validate from '../factories/login/validate';
import addSell from '../factories/sells/addSell';
import deleteSell from '../factories/sells/deleteSell';
import products from '../factories/inventoryManagement/products';
import findsSells from '../factories/controlSells/findSells';
import findDeliveries from '../factories/deliveries/findDeliveries';
import changeStatusDeliveries from '../factories/deliveries/changeStatusDeliveries';
import editAddressDelivery from '../factories/deliveries/editAddressDelivery';
import setPaymentsonDelivery from '../factories/deliveries/setPaymentsonDelivery';
import multer from '../factories/files/uploadMulter';
import deleteLogo from '../factories/settings/deleteLogo';
import validateForgotPassword from '../factories/login/validateForgotPassword';
import changeForgotPassword from '../factories/login/changeForgotPassword';
import verifyCodeForgotPassword from '../factories/login/verifyCodeForgotPassword';
import fiscalParameters from '../factories/settings/fiscalParameters/fiscalParameters';
import changeFiscalParameters from '../factories/settings/fiscalParameters/changeFiscalParameters';
import findTaxOptions from '../factories/inventoryManagement/findTaxOptions';
import uploadFile from '../factories/files/uploadFile';
import { deleteFile } from '../factories/files/deleteFile';
import productsToSell from '../factories/sells/productsToSell';
import { createSellFiscalNote } from '../factories/fiscal/createSellFiscalNote';
import { generateDanfe } from '../services/api/danfeGenerateApi';
import getCities from '../factories/people/getCities';
import { getXmlFiscalNote } from '../factories/fiscal/getXmlFiscalNote';
import { EventCancelNote } from '../factories/fiscal/eventCancelNote';
import { fiscalEvents } from '../factories/fiscal/getFiscalEvents';
import { getFiscalNotes } from '../factories/fiscal/getFiscalNotes';
import { getTaxGroups } from '../factories/fiscal/getTaxGroups';
import { PostTaxGroup } from '../factories/fiscal/PostTaxGroup';
import { PutTaxGroup } from '../factories/fiscal/PutTaxGroup';

const router = Router();

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
router.get("/findTaxOptions", findTaxOptions)
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
router.get('/cities', getCities)
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

// START FISCAL
router.post("/createSellFiscalNote", createSellFiscalNote)
router.get("/getXmlFiscalNote", getXmlFiscalNote)
router.post("/danfeGenerator", generateDanfe)
router.post("/eventCancelNote", EventCancelNote)
router.get("/fiscalEvents", fiscalEvents)
router.get("/fiscalNotes", getFiscalNotes)

router.get("/taxGroups", getTaxGroups)
router.post("/taxGroups", PostTaxGroup)
router.put("/taxGroups", PutTaxGroup)
// END FISCAL


export default router