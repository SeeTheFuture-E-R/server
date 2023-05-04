
const UserDal = require('../dal/dalUser')
const { Op } = require('sequelize');

class UserController {

    getAllUsers = async (req, res) => {
        const { userId, firstName, lastName, email } = req.query

        let where = {}
        if (userId) where.userId = userId
        if (firstName) where.firstName = firstName
        if (lastName) where.lastName = lastName
        if (email) where.email = email

        const users = await UserDal.getAllUsers(where)

        if (!users?.length) {
            return res.status(400).json({ message: 'No users found' })
        }
        // console.log(users)
        res.json(users)
    }

    deleteUser = async (req, res) => {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ message: 'user ID required' })
        }
        await UserDal.deleteUser(id);
        res.json(`user with ID ${id} deleted`)
    }

    updateUser = async (req, res) => {
        console.log()
        const { id } = req.params
        console.log(id)
        const { userId, firstName, lastName, handicap_precentage, points, phone, password, mail, birth_year, family_status, num_of_children, identity_card, handicap_card, blind_card } = req.body
        console.log(id +userId+firstName +lastName +mail)
        if (!id || !userId || !firstName || !lastName ||  !mail)//||!password  || !identity_card || !handicap_card || !blind_card) {
         {  return res.status(400).json({ message: 'All fields are required' })
        }
        const user = await UserDal.updateUser(id, { firstName, lastName, mail})//, birth_year, family_status, num_of_children, identity_card, handicap_card, blind_card, handicap_precentage, points, phone, password })
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        res.json(user)
    }

    getUserByUserId = async (req, res) => {
        const userId = req.params.id
        const users = await UserDal.getUserByUserId(userId)
        res.json(users)
    }
}

const userController = new UserController();
module.exports = userController;