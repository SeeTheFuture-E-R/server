
const {Sequelize}=require('sequelize')
const {sequelize}=require('./sequelize')
const {applyExtraSetup} = require('./extra-step')

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.users = require('./users')
db.books  = require('./books')
db.friends  = require('./friends')
db.products  = require('./products')
db.purchase_details  = require('./purchase_details')
db.purchases  = require('./purchases')
db.experiences  = require('./experiences')

applyExtraSetup()

db.sequelize.sync({ alter: true })
.then(() => {
console.log('stages of connecting to DB!!😄😃😊😋🙂🙄🥱😪😫😴❤')
})
module.exports = db
