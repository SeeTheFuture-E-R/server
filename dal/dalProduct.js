const db = require('../models/index')
const Products = db.products

class ProductsDal {

    getAllProducts = async () => {
        const products = await Products.findAll({})
        return products;
    }

    addProduct = async (newProduct) => {

        const product = await Products.create(newProduct)
        return product
    }

    getProductById = async (productId) => {
        const product = await Products.findOne({ where: { productId: productId } })
        return product
    }

    getProductsByCategory = async(category)=>{

        const product = await Products.findAll({ where: { category: category } })
        return product
    }

    deleteProduct = (async (productId) => {

        await Products.destroy({
            where: {
                productId: productId
            }
        });
    })

    updateProduct = async (productId, newProduct) => {
       
        const product = await Products.update(newProduct, { where: { productId: productId } })
        return product
    }

   
}

const productsDal = new ProductsDal();
module.exports = productsDal;