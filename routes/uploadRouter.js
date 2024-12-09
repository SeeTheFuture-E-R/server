const express = require("express")
const router = express.Router()
const uploadController = require("../controllers/uploadController")
const multer = require('multer');
const storage = multer.memoryStorage()
//const upload = multer({ storage: storage })

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

router.route("/")
    .post(upload.single("file"), uploadController.uploadImageToFriend)

router.route("/:id").post(upload.array('file'), uploadController.uploadFilesToUser);

module.exports =router