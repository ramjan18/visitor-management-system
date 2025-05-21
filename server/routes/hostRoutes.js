const router = require("express").Router();


const {getVisitorByHostId} = require("../controllers/visitorController/getVisitorByHostId");
const {getPreRegistrationById} = require("../controllers/preRegistrationController/getPreRegistrationById");
const {getUserById} = require("../controllers/hostController/getUserById")


router.get("/getVisitorByHostId/:id" , getVisitorByHostId);
router.get("/getPreRegistrationByHostId/:id",getPreRegistrationById);
router.get("/getUserById/:id" ,getUserById )

module.exports = router ;