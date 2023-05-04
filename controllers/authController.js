const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userDal = require('../dal/dalUser')
const db = require('../models/index')
const User = db.users
const Mail = require('../utils/email')
const Calc = require('../utils/calc')
const Validator = require('validator')

const login = async (req, res) => {
    console.log(req.body.userId)
    console.log(req.body.password)
    console.log("👌")

    const { userId, password } = req.body;

    if (!userId || !password) return res.status(400).json({ message: 'All fields are required' })

    //const foundUser = await userDal.getAllUsers({userId:userId})
    const foundUser = await userDal.getUserByUserIdWitePassword(userId)
    console.log(foundUser + "nnnnnnnnnnnn")
    if (!foundUser)
        return res.status(500).json({ message: 'User not found' })

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match)
        return res.status(401).json({ message: 'Unauthorized try other password' })
    const userInfo = {
        userId: foundUser.userId, firstName: foundUser.firstName,
        lastName: foundUser.lastName, email: foundUser.email,
        id: foundUser.id
    }
    console.log(userInfo)
    //Create the token
    user = await userDal.getUserByUserIdWitePassword(userId)
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.setHeader('Authorization', `Bearer ${accessToken}`)
    console.log(accessToken)
    res.json({ accessToken: accessToken, user: user })
}


const register = async (req, res) => {

    console.log(req.body.userId)
    console.log(req.body.password)
    console.log("👌")
    // identity_card, handicap_card, blind_card 
    const { userId, firstName, lastName, handicap_precentage, phone, email, password, birth_year, family_status, num_of_children} = req.body
    console.log(userId, firstName, lastName, email, password)
    if (!userId || !firstName || !lastName || !email || !password) {

        return res.status(400).json({ message: 'All fields are required' })
    }
    const duplicate = await User.findOne({ where: { userId: userId } })
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate userId" })
    }

    if (!Validator.isEmail(email))
        return res.status(400).json({ message: 'The email is invalid' })

    if (!Validator.isIdentityCard(userId, 'he-IL'))
        return res.status(400).json({ message: 'The UserId is invalid' })

    if (phone && !Validator.isMobilePhone(phone, 'he-IL'))
        return res.status(400).json({ message: 'The phone is invalid' })

    const hashedPwd = await bcrypt.hash(password, 10);

    const points = Calc.calcPoints({ handicap_precentage, birth_year, family_status, num_of_children })

    const code = 00000

    await Mail.sendMail(email, 'email from node js', `wow!!! you successed  💯😂🤣😍😋💯
    num of points ${points} your code is ${code}`)

    const userObject = { userId, firstName, lastName, handicap_precentage, points, phone, password: hashedPwd, email, birth_year, family_status, num_of_children, identity_card, handicap_card, blind_card }
    const user = await userDal.addUser(userObject)
    if (user) {
        return res.status(201).json({
            message: `New user ${user.firstName} ${user.lastName} created`
        })
    }
    else {
        return res.status(400).json({ message: 'Invalid user data received' })
    }

}

module.exports = { login, register }