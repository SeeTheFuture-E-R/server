const ProductsDal = require("../dal/dalProduct")

class ProductsController {

    getAllProducts = (async (req, res) => {
        
        const products = await ProductsDal.getAllProducts()
        if (!products?.length) {
            return res.status(400).json({ message: 'No products found' })
        }

        res.json(products)
    })

    addProduct = async (req, res) => {
        const { name, description, price, company, picture, category} = req.body
        // Confirm data
        if ( !name || !price || !picture||!category) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        
        const product = await ProductsDal.addProduct({ name, description, price, company, picture, category})
        if (product) { // Created
            return res.status(201).json({ message: 'New product created' })
        }
        else {
            return res.status(400).json({ message: 'Invalid product data received' })
        }

    }

    getProductById = async (req, res)=>{
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({ message: 'product ID required' })
        }

        const product = await ProductsDal.getProductById(productId)

        res.json(product)
    }

    getProductsByCategory = async(req, res)=>{

        const category = req.query.category
        const products = await ProductsDal.getProductsByCategory(category)

        if (!products?.length) {
            return res.status(400).json({ message: 'No products found in this category' })
        }

        res.json(products)
    }

    deleteProduct = (async (req, res) => {
        const { productId } = req.params
        if (!productId) {
            return res.status(400).json({ message: 'product ID required' })
        }
        await ProductsDal.deleteProduct(productId)

        res.json(`product with ID ${productId} deleted`)
    })

    updateProduct = (async (req, res) => {
        const { name, description, price, company, picture} = req.body
        console.log({ name, description, price, company, picture} )
        const productId = req.params.productId
        console.log(productId)

        // Confirm data
        if (!name || !price || !picture) {
            return res.status(400).json({
                message: 'All fields are required'
            })
        }
        const product = await ProductsDal.updateProduct(productId, { name, description, price, company, picture })
        if (!product) {
            return res.status(400).json({ message: 'product not found' })
        }
        res.json(product)
    })

}

const productController = new ProductsController();
module.exports = productController;