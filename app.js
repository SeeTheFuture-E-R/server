
require('dotenv').config()
const express = require("express");
// const http = require("http");

const bookRouter = require("./routes/bookRouter")
const userRouter = require("./routes/userRouter")
const experienceRouter = require("./routes/experienceRouter")
const friendsRouter = require("./routes/friendsRouter")
const productsRouter = require("./routes/productsRouter")
const purchase_detailsRouter = require("./routes/purchase_detailsRouter")
const purchaseRouter = require("./routes/purchaseRouter")
const authRoutes = require("./routes/authRouter")
const mailRouter = require("./routes/mailRouter")
const uploadRouter = require('./routes/uploadRouter')
const paypalRouter = require('./routes/paypalRouter')


const cookieParser = require('cookie-parser')
const app = express();
const cors = require('cors')
const path = require('path')
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())
app.use(cors())



app.use("/books", bookRouter)
app.use("/users", userRouter)
app.use("/experiences", experienceRouter)
app.use("/friends", friendsRouter)
app.use("/products", productsRouter)
app.use("/purchase_details", purchase_detailsRouter)
app.use("/purchases", purchaseRouter)
app.use('/auth', authRoutes)
app.use('/mail', mailRouter)
app.use("/upload", uploadRouter)
app.use("/paypal", paypalRouter)


app.use((req, res) => {
    res.status(404)
    res.send("oooooooooops Error!💥 you are really stupid😤")
})


app.listen(process.env.PORT, () => {
    console.log(`✔ app running on port ${process.env.PORT} ✔ 😂`);
})



//משושן
// app.all('*', (req, res) => {
//     res.status(404)
//     if (req.accepts('html')) {
//         res.sendFile(path.join(__dirname, 'views', '404.html'))
//     } else if (req.accepts('json')) {
//         res.json({ message: '404 Not Found' })
//     } else {
//         res.type('txt').send('404 Not Found')
//     }
// })