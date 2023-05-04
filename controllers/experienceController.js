const db = require('../models/index')
const Experiences = db.experiences
const experienceDal = require('../dal/dalExperience')
const Calc = require('../utils/calc')
class ExperiencesController {

    getAllExperience = (async (req, res) => {
        const experiences = await experienceDal.getAllExperience();
        if (!experiences?.length) {
            return res.status(400).json({ message: 'No experiences found' })
        }

        res.json(experiences)
    })

    getExperiencesByUserId = (async (req, res) => {
        const userId = req.params.userId;
        const experiences = await experienceDal.getExperiencesByUserId(userId);
        res.json(experiences)
    })

    getExperienceByExperienceId = (async (req, res) => {
        const experienceId = req.params.experienceId;
        const experiences = await experienceDal.getExperiencesByExperienceId(experienceId);
        res.json(experiences)
    })

    addExperiences = async (req, res) => {
        const { userId, productId } = req.body
        // Confirm data
        if (!userId || !productId ) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const expireDate = Calc.calcExpireDate()
        const experience = await experienceDal.addExperiences({ userId, productId , expireDate})
        if (experience) { // Created
            res.json(experience)
        }
        else {
            return res.status(400).json({ message: 'Invalid experience data received' })
        }
    }


    deleteExperience = (async (req, res) => {
        const { experienceId } = req.body
        if (!experienceId) {
            return res.status(400).json({ message: 'experienceId required' })
        }
        await experienceDal.deleteExperience(experienceId)
        res.json(`Purchase with ID ${experienceId} deleted`)
    })

    updateExperience = (async (req, res) => {
        const experienceId = req.params.experienceId
        const { userId, productId, expireDate } = req.body
        if (!experienceId ||!userId || !productId || !expireDate) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const updatexp={ userId, productId, expireDate }
        const experience = await experienceDal.updateExperience(updatexp, experienceId);
        if (!experience) {
            return res.status(400).json({ message: 'experience not found' })
        }
        res.json(experience)

    })

}

const experienceController = new ExperiencesController();
module.exports = experienceController;