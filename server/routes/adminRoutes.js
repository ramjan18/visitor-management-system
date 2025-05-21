const router = require("express").Router();


const {deleteVisitors} = require("../controllers/visitorController/deleteVisitor");
const {editPreRegistration} = require("../controllers/preRegistrationController/editPreRegistration");
const {editVisitor} = require("../controllers/visitorController/editVisitor");
const {getAllVisitors} = require("../controllers/visitorController/getAllVisitors");
const {getVisitorById} = require("../controllers/visitorController/getVisitorById");
const {getPreRegistrationById} = require("../controllers/preRegistrationController/getPreRegistrationById");
const {getAllUsers} = require("../controllers/adminController/getAllUser");
const {getAllPreRegistrations} = require("../controllers/preRegistrationController/getAllPreRegistrations")


router.delete("/deleteVisitor/:ids" , deleteVisitors);
 router.patch("/editPreRegistration" , editPreRegistration);
router.patch("/editVisitor", editVisitor);
router.get("/getAllVisitor" ,getAllVisitors );
router.get("/getVisitorById/:id" , getVisitorById);
router.get("/getPreRegistrationById/:id" , getPreRegistrationById);
router.get('/getAllUsers' , getAllUsers);
router.get("/getAllPreRegistrations" ,getAllPreRegistrations );


module.exports = router;
