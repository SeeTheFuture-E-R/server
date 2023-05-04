
const express = require("express");
const paypalRouter = express.Router();
const paypalController = require("../controllers/paypalController");
const verifyJWT = require("../middleware/verifyJWT")

paypalRouter.route("/")
    .post(verifyJWT, paypalController.pay)

// paypalRouter.route("/success")
//     .get(verifyJWT,  paypalController.success)

paypalRouter.route("/cancel")
    .get(verifyJWT, paypalController.cancel);


module.exports = paypalRouter;