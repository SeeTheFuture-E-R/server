const PurchaseDal = require('../dal/dalPurchase')
const Purchase_detailsDal = require('../dal/dalPurchase_details')
const UserDal = require('../dal/dalUser')
class PurchaseController {

    getAllPurchase = (async (req, res) => {
        
        const purchase = await PurchaseDal.getAllPurchase()

        if (!purchase?.length) {
            return res.status(400).json({ message: 'No purchases found' })
        }

        res.json(purchase)
    })

    getPurchaseByPurchaseId = (async (req, res) => {
        const purchaseId=req.params.purchaseId
        if (!purchaseId) {
            return res.status(400).json({ message: 'No PurchasId' })
        }
        const purchase = await PurchaseDal.getPurchaseByPurchasId(purchaseId)
        if(!purchase){
            res.status(400).json({message: 'Purchase not found'})
        }
        else
            res.json(purchase)
    })


    addPurchase = async (req, res) => {
        const { date, userId, final_price, purchase_details } = req.body
        if (!date || !final_price || !userId) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const user=await UserDal.getUserByUserId(userId)
        const purchase = await PurchaseDal.addPurchase({ date, userId, final_price })
        console.log("succses1")
        if (purchase) {
            console.log(purchase.purchaseId+"jhjhjhjhjhjhjhjhjh")
            purchase_details.map(async(x)=> {
                x.purchasePurchaseId=purchase.purchaseId;
                 x.discount_precentage=user.points ;
                x.purchaseId=purchase.purchaseId;
                x.productProductId=x.productId
             await Purchase_detailsDal.addPurchase_details(x)})
            return res.status(201).json({ message: 'New Purchase created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid Purchase data received' })
        }

    }


    deletePurchase = async (req, res) => {
        const { purchaseId } = req.params
        if (!purchaseId) {
            return res.status(400).json({ message: 'purchaseId required' })
        }
        await PurchaseDal.deletePurchase(purchaseId);
        res.json(`Purchase with ID ${purchaseId} deleted`)
    }

    updatePurchase = async (req, res) => {
        const { purchasesId, data, userId, final_price } = req.body
        // Confirm data
        if (!purchaseId || !productId) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const purchase = await PurchaseDal.updatePurchase(purchasesId, {data, userId, final_price })
        if (!purchase) {
            return res.status(400).json({ message: 'purchases not found' })
        }
        res.json(purchase)
    }

    getPurchaseByUserId = async (req, res) => {
        const userId = req.params.userId
        const purchases = await PurchaseDal.getPurchaseByUserId(userId)
        res.json(purchases)
    }
}

const purchaseController = new PurchaseController();
module.exports = purchaseController;