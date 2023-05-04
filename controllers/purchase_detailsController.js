
const Purchase_detailsDal = require('../dal/dalPurchase_details')

class Purchase_detailsController {

    getAllPurchase_details = (async (req, res) => {
        const purchases_details = await Purchase_detailsDal.getAllPurchase_details()
        if (!purchases_details?.length) {
            return res.status(400).json({ message: 'No purchases_details found' })
        }

        res.json(purchases_details)
    })

    addPurchase_details = async (req, res) => {
        const { purchaseId, productId, count, price_per_unit, discount_precentage } = req.body
        // Confirm data
        if (!purchaseId || !productId || !price_per_unit) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const purchase_details = await Purchase_detailsDal.addPurchase_details({ purchaseId, productId, count, price_per_unit, discount_precentage })

        if (purchase_details) { // Created
            return res.status(201).json({ message: 'New Purchase_details created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid Purchase_details data received' })
        }
    }

    deletePurchase_details = (async (req, res) => {

        const { id } = req.params
        console.log(id)
        if (!id) {
            return res.status(400).json({ message: 'Id required' })
        }
        const succ = await Purchase_detailsDal.deletePurchase_details(id);
        res.json(succ)
    })

    updatePurchase_details = (async (req, res) => {
        const { purchaseId, productId, count, price_per_unit, discount_precentage } = req.body
        // Confirm data
        const id = req.params.id
        if (!purchaseId || !productId) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }

        const purchase_details = await Purchase_detailsDal.updatePurchase_details(id, { purchaseId, productId, count, price_per_unit, discount_precentage })
        if (!purchase_details) {
            return res.status(400).json({ message: 'purchase_details not found' })
        }
        res.json(purchase_details)
    })

    getPurchase_detailsByPurchaseId = async (req, res) => {
        const purchaseId = req.params.purchaseId

        const purchases_details = await Purchase_detailsDal.getPurchase_detailsByPurchaseId(purchaseId)

        res.json(purchases_details)
    }
}

const purchase_detailsController = new Purchase_detailsController();
module.exports = purchase_detailsController;
