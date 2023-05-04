const db = require('../models/index')
const Purchase_details = db.purchase_details
const Purchase=require('../models/purchases')
class Purchase_detailsDal {

    getAllPurchase_details = async () => {
        const purchases_details = await Purchase_details.findAll({
            include:Purchase
        })
        return purchases_details
    }

    addPurchase_details = async (newPurchase_details) => {
console.log(newPurchase_details.purchaseId+"newPurchase_details")
        const purchase_details = await Purchase_details.create(newPurchase_details)
        return purchase_details
    }

    deletePurchase_details = async (id) => {

       const succ= await Purchase_details.destroy({
            where: {
                id: id,
            }
        });
        console.log(succ)
        return succ
    }

    updatePurchase_details = async (id, newPurchase_details) => {

        const purchase_details = await Purchase_details.update(newPurchase_details, { where: { id: id } })
        return purchase_details
    }

    getPurchase_detailsByPurchaseId = async (purchaseId) => {
        const purchases_details = await Purchase_details.findOne({ where: { purchaseId: purchaseId } })
        res.json(purchases_details)
    }
}

const purchase_detailsDal = new Purchase_detailsDal();
module.exports = purchase_detailsDal;