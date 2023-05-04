const express = require("express");
experienceRouter = express.Router();
const experienceController=require("../controllers/experienceController")
const verifyJWT = require("../middleware/verifyJWT")

experienceRouter.route("/")
    .get(experienceController.getAllExperience)
    .post(experienceController.addExperiences);

experienceRouter.route("/:experienceId")
    .delete(verifyJWT,experienceController.deleteExperience)
    .put(verifyJWT, experienceController.updateExperience)
    .get(verifyJWT,experienceController.getExperienceByExperienceId);
    


module.exports = experienceRouter;
