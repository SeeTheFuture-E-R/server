const express = require("express");
purchaseRouter = express.Router();
const purchaseController = require("../controllers/purchaseController");
const verifyJWT = require("../middleware/verifyJWT")

purchaseRouter.route("/")
    .get( purchaseController.getAllPurchase)
    .post(verifyJWT, purchaseController.addPurchase);

purchaseRouter.route("/:purchaseId")
    .delete(verifyJWT, purchaseController.deletePurchase)
    .put(verifyJWT, purchaseController.updatePurchase)
    .get(verifyJWT, purchaseController.getPurchaseByPurchaseId);



module.exports = purchaseRouter;
