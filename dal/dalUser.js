const Book = require('../models/books')
const Experience = require('../models/experiences')
const db = require('../models/index')
const Purchase = require('../models/purchases')
const {Op}=require('sequelize')

const User = db.users

class UserDal {

    getAllUsers = async (where) => {
        const users = await User.findAll({
            attributes: {
                exclude: ['password', 'identity_card', 'handicap_card', 'blind_card'],
                
            },
            include: [Book, Purchase, Experience],
            where: where
        })
        console.log(users)
        return users
    }


    addUser = async (newUser) => {
        console.log(newUser)
        const user = await User.create(newUser)
        return user
    }


    deleteUser = async (id) => {
        await User.destroy({
            where: {
                id: id
            }
        });
    }

    updateUser = async (userId, newUser) => {

        const user = await User.update(newUser, { where: { id: userId } })
        return user
    }

    getUserByUserId = async (userId) => {
        const user = await User.findOne({
            attributes: {
                exclude: ['password', 'identity_card', 'handicap_card', 'blind_card'],
                
            },
            include: [Book, Purchase, Experience],
            where:   { [Op.or]:{id: userId,userId:userId }}
           
        })
        return user
    }
    getUserByUserIdWitePassword = async (userId) => {
        const user = await User.findOne({
            attributes: {
                exclude: ['identity_card', 'handicap_card', 'blind_card'],
                
            },
            include: [Book, Purchase, Experience],
            where:   { [Op.or]:{id: userId,userId:userId }}
           
        })
        return user
    }
}

const userDal = new UserDal();
module.exports = userDal;