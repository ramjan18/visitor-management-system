const router = require("express").Router();

const {preRegistrationByHost} = require("../controllers/preRegistrationController/preRegistrationByHost");

router.get("/preRegistrationByHost/:id" , preRegistrationByHost)

module.exports = router ;