const router = require("express").Router();
const Product = require("../models/Product")
const { verifyTokenAuth, verifyTokenAdmin} = require("./verifyToken")
//CREATE PRODUCT
router.post("/",verifyTokenAdmin, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})

// //UPDATE USER INFORMATION
 router.put("/:id", verifyTokenAdmin, async(req, res) => {
  // Before updating check passsword and ecrypt
  
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            //set the new information
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
});

//DELETE
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json(`Product deleted`)
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
       res.status(200).json({product});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const queryNew = req.query.new
    const queryCategory = req.query.category;
    try {
        let products;

        if (queryNew) {
            products = await Product.find().sort({ createAt: -1 }).limit(2);
        } else if (queryCategory) {
            products = await Product.find({
                categories: {
                    $in :[queryCategory],
                }
            })
        } else {
            products = await Product.find(); 
        }
       res.status(200).json({products});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})


module.exports = router