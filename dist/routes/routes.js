"use strict";
//@ts-check
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const changePass_1 = __importDefault(require("../factories/settings/changePass"));
const findTransactions_1 = __importDefault(require("../factories/transactions/findTransactions"));
const addTransaction_1 = __importDefault(require("../factories/transactions/addTransaction"));
const addProduct_1 = __importDefault(require("../factories/inventoryManagement/addProduct"));
const editProduct_1 = __importDefault(require("../factories/inventoryManagement/editProduct"));
const deleteProduct_1 = __importDefault(require("../factories/inventoryManagement/deleteProduct"));
const findTransactionsProducts_1 = __importDefault(require("../factories/inventoryManagement/findTransactionsProducts"));
const findSellers_1 = __importDefault(require("../factories/people/findSellers"));
const editSeller_1 = __importDefault(require("../factories/people/editSeller"));
const addSeller_1 = __importDefault(require("../factories/people/addSeller"));
const findClients_1 = __importDefault(require("../factories/people/findClients"));
const editClient_1 = __importDefault(require("../factories/people/editClient"));
const addClient_1 = __importDefault(require("../factories/people/addClient"));
const deleteClient_1 = __importDefault(require("../factories/people/deleteClient"));
const deleteSeller_1 = __importDefault(require("../factories/people/deleteSeller"));
const aboutCorporation_1 = __importDefault(require("../factories/settings/aboutCorporation"));
const changeAboutCorporation_1 = __importDefault(require("../factories/settings/changeAboutCorporation"));
const listNcm_1 = __importDefault(require("../factories/settings/listNcm"));
const listItemType_1 = __importDefault(require("../factories/settings/listItemType"));
const addUser_1 = __importDefault(require("../factories/login/addUser"));
const validateMail_1 = __importDefault(require("../factories/login/validateMail"));
const logout_1 = __importDefault(require("../factories/login/logout"));
const chartBar_1 = __importDefault(require("../factories/home/chartBar"));
const chartDoughnut_1 = __importDefault(require("../factories/home/chartDoughnut"));
const chartArea_1 = __importDefault(require("../factories/home/chartArea"));
const chartBestSellers_1 = __importDefault(require("../factories/home/chartBestSellers"));
const chartTopSellingProducts_1 = __importDefault(require("../factories/home/chartTopSellingProducts"));
const chartRadar_1 = __importDefault(require("../factories/home/chartRadar"));
const findCfop_1 = __importDefault(require("../factories/inventoryManagement/findCfop"));
const sign_1 = __importDefault(require("../factories/login/sign"));
const validate_1 = __importDefault(require("../factories/login/validate"));
const addSell_1 = __importDefault(require("../factories/sells/addSell"));
const deleteSell_1 = __importDefault(require("../factories/sells/deleteSell"));
const products_1 = __importDefault(require("../factories/inventoryManagement/products"));
const findSells_1 = __importDefault(require("../factories/controlSells/findSells"));
const findDeliveries_1 = __importDefault(require("../factories/deliveries/findDeliveries"));
const changeStatusDeliveries_1 = __importDefault(require("../factories/deliveries/changeStatusDeliveries"));
const editAddressDelivery_1 = __importDefault(require("../factories/deliveries/editAddressDelivery"));
const setPaymentsonDelivery_1 = __importDefault(require("../factories/deliveries/setPaymentsonDelivery"));
const uploadMulter_1 = __importDefault(require("../factories/files/uploadMulter"));
const deleteLogo_1 = __importDefault(require("../factories/settings/deleteLogo"));
const validateForgotPassword_1 = __importDefault(require("../factories/login/validateForgotPassword"));
const changeForgotPassword_1 = __importDefault(require("../factories/login/changeForgotPassword"));
const verifyCodeForgotPassword_1 = __importDefault(require("../factories/login/verifyCodeForgotPassword"));
const fiscalParameters_1 = __importDefault(require("../factories/settings/fiscalParameters/fiscalParameters"));
const changeFiscalParameters_1 = __importDefault(require("../factories/settings/fiscalParameters/changeFiscalParameters"));
const findIcmsOptions_1 = __importDefault(require("../factories/inventoryManagement/findIcmsOptions"));
const uploadFile_1 = __importDefault(require("../factories/files/uploadFile"));
const deleteFile_1 = require("../factories/files/deleteFile");
const productsToSell_1 = __importDefault(require("../factories/sells/productsToSell"));
//START LOGIN//
router.post("/signIn", sign_1.default);
router.post("/validate", validate_1.default);
router.post("/adduser", addUser_1.default);
router.post("/validatemail", validateMail_1.default);
router.post("/logout", logout_1.default);
router.post("/validateForgotPassword", validateForgotPassword_1.default);
router.post("/changeForgotPassword", changeForgotPassword_1.default);
router.get("/verifyCodeForgotPassword", verifyCodeForgotPassword_1.default);
// END LOGIN
// START HOME
router.get("/charts/bar", chartBar_1.default);
router.get("/charts/doughnut", chartDoughnut_1.default);
router.get('/charts/area', chartArea_1.default);
router.get("/charts/bestsellers", chartBestSellers_1.default);
router.get("/charts/topsellingproducts", chartTopSellingProducts_1.default);
router.get("/charts/radar", chartRadar_1.default);
// END HOME
// START SELLS
router.post("/addsell", addSell_1.default);
router.post("/deletesell", deleteSell_1.default);
router.get("/productsToSell", productsToSell_1.default);
// END SELLS
// START CONTROL SELLS
router.post("/findsells", findSells_1.default);
// END CONTROL SELLS
// START DELIVERIES
router.get("/deliveries", findDeliveries_1.default);
router.patch("/changeStatusDeliveries", changeStatusDeliveries_1.default);
router.patch("/changeAddressDelivery", editAddressDelivery_1.default);
router.post("/setPaymentonDelivery", setPaymentsonDelivery_1.default);
// END DELIVERIES
// START INVENTORYMANAGEMENT
router.get("/products", products_1.default);
router.get("/listCfop", findCfop_1.default);
router.post("/addproduct", addProduct_1.default);
router.post("/editproduct", editProduct_1.default);
router.post("/deleteproduct", deleteProduct_1.default);
router.post("/findtransactionsproducts", findTransactionsProducts_1.default);
router.get("/findIcmsOptions", findIcmsOptions_1.default);
// END INVENTORYMANAGEMENT
// START TRANSCTIONS 
router.post("/findtransactions", findTransactions_1.default);
router.post("/addtransaction", addTransaction_1.default);
// END TRANSACTIONS
// START PEOPLE
router.post("/findsellers", findSellers_1.default);
router.post('/editseller', editSeller_1.default);
router.post('/addseller', addSeller_1.default);
router.post("/findclients", findClients_1.default);
router.post('/editclient', editClient_1.default);
router.post('/addclient', addClient_1.default);
router.post('/deleteclient', deleteClient_1.default);
router.post('/deleteseller', deleteSeller_1.default);
// END PEOPLE
// START SETTINGS
router.patch("/changepass", changePass_1.default);
router.post("/uploadfile", uploadMulter_1.default.single('file'), uploadFile_1.default);
router.delete("/deleteFile", deleteFile_1.deleteFile);
router.get("/aboutCorporation", aboutCorporation_1.default);
router.patch("/changeAboutCorporation", changeAboutCorporation_1.default);
router.get("/listNCM", listNcm_1.default);
router.get("/listItemType", listItemType_1.default);
router.delete("/deleteLogo", deleteLogo_1.default);
router.get("/fiscalParameters", fiscalParameters_1.default);
router.post("/changeFiscalParameters", changeFiscalParameters_1.default);
// END SETTINGS
router.delete("/deleteFile/:fileName");
exports.default = router;
