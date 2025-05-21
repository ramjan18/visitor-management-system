const {upload } = require("../config/multer")

const router = require("express").Router();

const {registrationForm} = require("../controllers/visitorController/registrationForm");
const {preRegister} = require("../controllers/preRegistrationController/preRegistration");
const { checkoutVisitor } = require("../controllers/visitorController/checkoutVisitor");
const {getVisitorByDate} = require("../controllers/visitorController/getVisitorsByDate");
const { updateStatus } = require("../controllers/visitorController/updateStatus");

router.post("/register" ,upload.single('photo') , registrationForm);
router.post("/preRegister" , preRegister);
router.get("/checkOutVisitor/:id" , checkoutVisitor);
router.get("/getVisitorByDate",getVisitorByDate);
router.patch("/updateStatus", updateStatus);

module.exports = router;