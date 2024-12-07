const db = require('../models/index')
const friends = db.friends
const { Op } = require('sequelize')
const User =require("../models/users")
class FriendsDal {
    getAllfriends = (async (where) => {

        const friendList = await friends.findAll({ where: { [Op.and]: where } })
        return friendList;
    })


    addfriend = async (name, userId, picturePath) => {
        console.log(name + " " + userId + " " + picturePath)
        console.log("cccccccccame")
        const friend = await friends.create({ picturePath, userId, name })

        return friend;
    }


    deletefriendById = (async (friendId) => {

        await friends.destroy({
            where: {
                friendId: friendId,
            }
        });
        return true;
    })

    updatefriend = (async (newFriend, userId) => {

        const friend = await friends.update(newFriend, { where: { id: userId } });
        return (friend);

    })

    getFriendById = (async (friendId) => {

        const friend = await friends.findOne({ where: { friendId: friendId } })
        return (friend);

    })

    updatePicturePath = (async(newPath, friendId)=>{
        console.log("😂😍kkkkkkkkkkkk😊", friendId, "😂😍kkkkkkkkkkkk😊")
        try{
            await friends.update({picturePath: newPath}, {where:{friendId: friendId}})
        const friend = await friends.findByPk(friendId)
        return (friend)
        }
        catch(e){
            console.log(e, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
        }

    })

    getfriendsByUserId = (async (userId) => {

        const friendList = await friends.findAll({ where: { userId: userId } })
        return friendList;
    })

}
const friendsDal = new FriendsDal();
module.exports = friendsDal;