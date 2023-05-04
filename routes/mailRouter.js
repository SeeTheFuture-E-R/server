
const express = require("express");
const mailRouter = express.Router();
const mailController = require("../controllers/mailController");
const verifyJWT = require("../middleware/verifyJWT")

mailRouter.route("/")
    .post(verifyJWT, mailController.sendMailByList)

module.exports = mailRouter;
