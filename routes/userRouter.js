
const express = require("express");
const { register } = require("../controllers/authController");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT");
const uploadController = require("../controllers/uploadController")
const multer = require("multer")

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/../public/documents")
  },
    filename: function (req, file, callback) {
      callback(null,file.fieldname + '-' + Date.now())
    }
  });
  


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

userRouter.route("/")
    .get(verifyJWT,userController.getAllUsers)

userRouter.route("/:id")
    .delete(verifyJWT,userController.deleteUser)
    .put(verifyJWT,userController.updateUser)
    .get(verifyJWT,userController.getUserByUserId)
    .post(upload.array('file'), uploadController.uploadFilesToUser);

module.exports = userRouter;
