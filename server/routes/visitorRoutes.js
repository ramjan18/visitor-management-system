const {upload } = require("../config/multer")

const router = require("express").Router();

const {registrationForm} = require("../controllers/visitorController/registrationForm");
const {preRegister} = require("../controllers/preRegistrationController/preRegistration");
const { checkoutVisitor } = require("../controllers/visitorController/checkoutVisitor");
const {getVisitorByDate} = require("../controllers/visitorController/getVisitorsByDate");
const { updateStatus } = require("../controllers/visitorController/updateStatus");
const { getVisitorByHostId } = require("../controllers/visitorController/getVisitorByHostId");
const { setMeetingTime } = require("../controllers/visitorController/setMeetingTime");

router.post("/register" ,upload.single('photo') , registrationForm);
router.post("/preRegister" , preRegister);
router.get("/checkOutVisitor/:id" , checkoutVisitor);
router.get("/getVisitorByDate",getVisitorByDate);
router.patch("/updateStatus", updateStatus);
router.get("/getVisitorByHostId/:id" , getVisitorByHostId);
router.patch('/setMeetingTime', setMeetingTime);

module.exports = router;