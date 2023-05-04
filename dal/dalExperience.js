const db = require('../models/index')
const Experiences = db.experiences
class ExperienceDal{
    getAllExperience = (async () => {

        const experiences = await Experiences.findAll({})
        return experiences;
    })


    addExperiences = (async (newExperiences ) => {

        const experience = await Experiences.create(newExperiences)
       return experience;
    })


    deleteExperience = (async ( experienceId) => {
       
        await Experiences.destroy({
            where: {
                experienceId:experienceId
            }
        });
        return true;
    })

    updateExperience = (async (exp, experienceId ) => {
        
        const experience = await Experiences.update(exp ,{where: { experienceId: experienceId }});
        return(experience);
      
    })

    getExperiencesByexperienceId = (async (experienceId) => {
       
        const experiences = await Experiences.findOne({ where: { experienceId: experienceId } })
        return experiences;
    })

    getExperiencesByUserId = (async (userId) => {
       
        const experienceses = await Experiences.findAll({ where: { userId: userId } })
        return experienceses;
    })

    getExperiencesByExperienceId = (async (experienceId) => {
        const experience = await Experiences.findOne({ where: { experienceId: experienceId } })
        return experience;
    })

}
const experienceDal = new ExperienceDal();
module.exports = experienceDal;