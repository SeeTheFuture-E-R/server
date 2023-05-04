const express = require("express");
purchase_detailsRouter = express.Router();
const purchase_detailsController = require("../controllers/purchase_detailsController");

purchase_detailsRouter.route("/")
    .get(purchase_detailsController.getAllPurchase_details)
    .post(purchase_detailsController.addPurchase_details);

purchase_detailsRouter.route("/:id")
    .delete(purchase_detailsController.deletePurchase_details)
    .get(purchase_detailsController.getAllPurchase_details)
    .put(purchase_detailsController.updatePurchase_details);

module.exports = purchase_detailsRouter;
