const router = require("express").Router();

const {login} = require("../controllers/authController/login");
const {signUp} = require("../controllers/authController/signUp");


router.post("/login" , login);
router.post("/signUp" , signUp)

module.exports = router ;