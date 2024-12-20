const fsPromises =require("fs").promises
const path = require("path")
const {v4:uuid} = require("uuid")
const friendsDal = require("../dal/dalfriend")
const bookDal = require("../dal/dalBook")
const upload = require("../utils/upload")
const productsDal = require("../dal/dalProduct")
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const stream = require('stream');

// Function to convert image to grayscale
function convertToGrayscale(image) {
    console.log(image,"imageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, image.width, image.height);
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
    console.log(data,"dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;      // Red channel
        data[i + 1] = avg;  // Green channel
        data[i + 2] = avg;  // Blue channel
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
}

// Function to save the canvas as an image
function saveCanvas(canvas, path) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path, buffer);
}

// Main function to process the image
async function processImage(image) {
    try {
        const grayscaleCanvas = convertToGrayscale(image);

        // Save 5 copies of the grayscale image
        for (let i = 1; i <= 5; i++) {
            saveCanvas(grayscaleCanvas, `grayscale_copy_${i}.png`);
        }

        console.log('Image processing complete. 5 copies saved.');
    } catch (error) {
        console.error('Error processing image:', error);
    }
}



const uploadImageToFriend = async (req, res) =>{
    const {friendId} = req.params
    
    if(!friendId){
        res.status(400).send("please send friend id")
    }

    if(!req.file){
        res.status(500).send("No file")
    }
  try{
        const file = req.file

        const folder = path.join(__dirname, "..", "public", "images", "friends")
        const Objfriend = await friendsDal.getFriendById(friendId)
        if (!Objfriend) {
            return res.status(404).send("Friend not found")
        }

        const filename = `${friendId}-${Objfriend.name}.png`
        const fileUrl  =`${folder}/${filename}`
        console.log(friendId, filename ,"kkkkkkkkkkkkkkkkkddddddddddddddddddddkkkkkkkkk")

        await fsPromises.writeFile(fileUrl, file.buffer)
        const friend = await friendsDal.updatePicturePath(filename, friendId)
        console.log(friend)
        return res.json({location: fileUrl, name:filename })
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }

}

const uploadFilesToUser = async(req, res) => {
    const { id } = req.params;
    const files = req.files;

    if (!id) {
        return res.status(400).send("Please send user id");
    }
    if (!files || files.length === 0) {
        return res.status(400).send("No files uploaded");
    }

    try {
        const folder = path.join(__dirname, "..", "public", "documents", "pdfs");
        await fsPromises.mkdir(folder, { recursive: true });

        const uploadedFiles = [];
        
        for (const file of files) {
            if (!file.mimetype.includes('pdf')) {
                throw new Error(`File ${file.originalname} is not a PDF`);
            }

            const filename = `${uuid()}_${file.originalname}`;
            const fileUrl = path.join(folder, filename);
            
            // Using streams to properly handle binary data
            await new Promise((resolve, reject) => {
                const writeStream = fs.createWriteStream(fileUrl);
                const bufferStream = new stream.PassThrough();

                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
                
                bufferStream.end(file.buffer);
                bufferStream.pipe(writeStream);
            });
            
            uploadedFiles.push({
                location: fileUrl,
                name: filename
            });
        }

        return res.json(uploadedFiles);
    } catch (err) {
        console.error('Upload error:', err);
        return res.status(500).send(err.message);
    }
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
    console.log(req.file.originalname, "*************************************8")
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
const uploadImageForProduct=async (req, res) =>{
    const {productId} = req.params

    if(!productId){
        res.status(400).send("please send book id")
    }
    if(!req.file){
        res.status(500).send("No file")
    }
    const file = req.file
    console.log(req.file,"$$$$$$$$$$$$$$$",productId,"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    const folder = path.join(__dirname, "..", "public", "images", "products")
    const filename = `${uuid()}_${file.originalname}`
    const fileUrl  =`${folder}/${filename}`

    console.log("producttttttttttttttttttttttttttttttttttttttttttttttttt")
    try{
        await fsPromises.writeFile(fileUrl, file.buffer)
        const product = await productsDal.updatePicturePath(filename, productId)
        console.log(product)
        return res.json({location: fileUrl, name:filename })
    }
    catch(err){
        res.status(500).send(err)
    }

}
module.exports = {uploadImageToFriend, uploadFilesToUser, uploadImageForBook, uploadImageForProduct}