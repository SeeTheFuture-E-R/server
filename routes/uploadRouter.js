const express = require("express")
const router = express.Router()
const uploadController = require("../controllers/uploadController")
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.route("/")
    .post(upload.single("file"), uploadController.uploadImageToFriend)

module.exports =router