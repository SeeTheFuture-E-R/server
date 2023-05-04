const db = require('../models/index')
const friendsDal = require("../dal/dalfriend")
const upload = require('../utils/upload')

class friendsController {

    getAllfriends = (async (req, res) => {
        const {userId} = req.query
        console.log(userId)
        let where = {}
        if (userId) where.userId = userId
        
        const friends = await friendsDal.getAllfriends(where)
        if (!friends?.length) {
            return res.status(400).json({ message: 'No friends found' })
        }

        res.json(friends)
    })

    getfriendById = (async (req, res)=>{
        const { friendId } = req.body
        if (!friendId) {
            return res.status(400).json({ message: 'friend ID required' })
        }

        const friend = await friendsDal.getfriendById(friendId);
    })

    getfriendsByUserId = (async (req, res) => {
        const userId = req.params.userId
        const friends = await friendsDal.getfriendsByUserId(userId)
        res.json(friends)
    })

    addfriend = async (req, res) => {
        const { name, userId} = req.body
        // Confirm data
        if (!name || !userId) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        //  const newPicturePath = 
        const friend = await friendsDal.addfriend( name, userId )
        
        if (friend) { // Created
            console.log(friend+"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhtd")
            return res.json(friend)
        }
        else { 
            console.log("faled")
            return res.status(400).json({ message: 'Invalid friend data received' })
        }
    }

    
    deletefriendById = (async (req, res) => {
        const { friendId } = req.params
        console.log(friendId)
        if (!friendId) {
            return res.status(400).json({ message: 'friend ID required' })
        }
        await friendsDal.deletefriendById(friendId);
     
        res.json(`friend with ID ${friendId} deleted`)
    })

    updatefriend = (async (req, res) => {
        const { friendId, name, userId, picturePath, expireDate } = req.body
        // Confirm data
        if (!friendId || !name || !userId || !picturePath) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const friend = await friendsDal.updatefriend({ friendId, name, userId, picturePath, expireDate },friendId)
        if (!friend) {
            return res.status(400).json({ message: 'friend not found' })
        }
        res.json(friend)
    })

    
}

const friendController = new friendsController();
module.exports = friendController;