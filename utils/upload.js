const fsPromises = require("fs").promises
const path = require("path")
const { v4: uuid } = require("uuid")
const upload = async (file) => {
    if (!file) {
        return 0
    }
    const folder = path.join(__dirname, "..", "public", "images")
    const filename = `${uuid()}_${req.file.originalname}`
    const fileUrl = `${folder}/${filename}`


    try {
        await fsPromises.writeFile(fileUrl, req.file.buffer)
        return { location: fileUrl, name: filename }
    } catch (err) {
       console.log(err)
    }

}

module.exports =  upload 