
const express = require("express");
const friendsRouter = express.Router();
const friendsController = require("../controllers/friendsController");
const uploadController =  require("../controllers/uploadController")
const verifyJWT = require("../middleware/verifyJWT")
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

friendsRouter.route("/")
    .get(verifyJWT, friendsController.getAllfriends)
    .post(verifyJWT, friendsController.addfriend)

friendsRouter.route("/:friendId")
    .get(verifyJWT, friendsController.getfriendById)
    .delete(verifyJWT,friendsController.deletefriendById)
    .put(verifyJWT,friendsController.updatefriend)
    .post(verifyJWT, upload.single("file"), uploadController.uploadImageToFriend)

module.exports = friendsRouter;
