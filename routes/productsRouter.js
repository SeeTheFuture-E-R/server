
const express = require("express");
const productsRouter = express.Router();
const productsController = require("../controllers/productsController");
const verifyJWT = require("../middleware/verifyJWT")
const uploadController =  require("../controllers/uploadController")
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


productsRouter.route("/")
    .get(productsController.getAllProducts)
    .post(verifyJWT, productsController.addProduct)

productsRouter.route("/search")
    .get(productsController.getProductsByCategory)
    
productsRouter.route("/:productId")
    .get(productsController.getProductById)
    .delete(verifyJWT, productsController.deleteProduct)
    .put(verifyJWT, productsController.updateProduct)
    .post(verifyJWT, upload.single("file"), uploadController.uploadImageForProduct);


module.exports = productsRouter;
