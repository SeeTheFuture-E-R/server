
const express = require("express");
bookRouter = express.Router();
const bookController = require("../controllers/bookController");
const uploadController =  require("../controllers/uploadController")
const verifyJWT = require("../middleware/verifyJWT")
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

bookRouter.route("/")
    .get(bookController.getAllBooks)
    .post(verifyJWT,bookController.addBook);


bookRouter.route("/:bookId")
    .delete(verifyJWT, bookController.deleteBook)
    .put(verifyJWT,bookController.updateBook)
    .get(bookController.getBooksByBookId)
    .post(verifyJWT, upload.single("file"), uploadController.uploadImageForBook);

module.exports = bookRouter;
