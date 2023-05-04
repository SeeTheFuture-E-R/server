
const express = require("express");
const { register } = require("../controllers/authController");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const multer = require("multer")

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/../public/documents")
  },
    filename: function (req, file, callback) {
      callback(null,file.fieldname + '-' + Date.now())
    }
  });
  
const upload = multer({ storage: storage })
const uploadController = require("../controllers/uploadController")


userRouter.route("/")
    .get(verifyJWT,userController.getAllUsers)

userRouter.route("/:id")
    .delete(verifyJWT,userController.deleteUser)
    .put(verifyJWT,userController.updateUser)
    .get(verifyJWT,userController.getUserByUserId)
    .post(upload.array('files'), uploadController.uploadFilesToUser)

module.exports = userRouter;
