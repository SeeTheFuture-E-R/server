
const express = require("express");
const productsRouter = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT")


productsRouter.route("/")
    .get(productsController.getAllProducts)
    .post(verifyJWT, productsController.addProduct)

productsRouter.route("/search")
    .get(productsController.getProductsByCategory)
    
productsRouter.route("/:productId")
    .get(productsController.getProductById)
    .delete(verifyJWT, productsController.deleteProduct)
    .put(verifyJWT, productsController.updateProduct);


module.exports = productsRouter;
