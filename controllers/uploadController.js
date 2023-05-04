const fsPromises =require("fs").promises
const path = require("path")
const {v4:uuid} = require("uuid")
const friendsDal = require("../dal/dalfriend")
const bookDal = require("../dal/dalBook")
const upload = require("../utils/upload")

const uploadImageToFriend = async (req, res) =>{
    const {friendId} = req.params

    if(!friendId){
        res.status(400).send("please send friend id")
    }
    if(!req.file){
        res.status(500).send("No file")
    }
    const file = req.file
    console.log(file)
    const folder = path.join(__dirname, "..", "public", "images", "friends")
    const filename = `${uuid()}_${req.file.originalname}`
    const fileUrl  =`${folder}/${filename}`


    try{
        await fsPromises.writeFile(fileUrl, req.file.buffer)
        const friend = await friendsDal.updatePicturePath(filename, friendId)
        console.log(friend)
        return res.json({location: fileUrl, name:filename })
    }
    catch(err){
        res.status(500).send(err)
    }

}

const uploadFilesToUser = async(req, res)=>{
    const {id} = req.params
    const {files} = req.files||{}
    console.log(id)

    console.log(file)


    if(!id){
        res.status(400).send("please send friend id")
    }
    if(!file){
        res.status(500).send("No file")
    }
    // const folder = path.join(__dirname, "..", "public", "images")
    // const filename = `${uuid()}_${req.file.originalname}`
    // const fileUrl  =`${folder}/${filename}`


    // try{
    //     await fsPromises.writeFile(fileUrl, req.file.buffer)
    //     const friend = await friendsDal.updatePicturePath(fileUrl, friendId)
    //     console.log(friend)
    //     return res.json({location: fileUrl, name:filename })
    // }catch(err){
    //     res.status(500).send(err)
    // }
    else res.send("bjhgj")
}

const uploadImageForBook=async (req, res) =>{
    const {bookId} = req.params

    if(!bookId){
        res.status(400).send("please send book id")
    }
    if(!req.file){
        res.status(500).send("No file")
    }
    const file = req.file
    const folder = path.join(__dirname, "..", "public", "images", "books")
    const filename = `${uuid()}_${file.originalname}`
    const fileUrl  =`${folder}/${filename}`


    try{
        await fsPromises.writeFile(fileUrl, file.buffer)
        const book = await bookDal.updatePicturePath(filename, bookId)
        console.log(book)
        return res.json({location: fileUrl, name:filename })
    }
    catch(err){
        res.status(500).send(err)
    }

}
module.exports = {uploadImageToFriend, uploadFilesToUser, uploadImageForBook}