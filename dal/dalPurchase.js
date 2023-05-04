const db = require('../models/index')
const Purchase = db.purchases
const User = require('../models/users')
const Purchase_details=require("../models/purchase_details")
class PurchaseDal {

    getAllPurchase = async () => {
        const purchase = await Purchase.findAll({
            include:Purchase_details
        })
        return purchase
    }

    addPurchase = async (newPurchase) => {

        const purchase = await Purchase.create(newPurchase)
        console.log(purchase+"addd")
        return purchase
    }

    deletePurchase = async (purchaseId) => {

        await Purchase.destroy({
            where: {
                purchaseId: purchaseId,
            }
        });
    }

    updatePurchase = async (purchaseId, newPurchase) => {

        const purchase = await Purchase.update(newPurchase, { where: { purchaseId: purchaseId } })
        return purchase
    }

    getPurchaseByUserId = async (userId) => {
        const purchases = await Purchase.findAll({ where: { userId: userId } })
        return purchases
    }

    getPurchaseByPurchasId = async (purchaseId) => {
        const purchase = await Purchase.findOne({ where: { purchaseId: purchaseId } })
        return purchase
    }
}

const purchaseDal = new PurchaseDal();
module.exports = purchaseDal;