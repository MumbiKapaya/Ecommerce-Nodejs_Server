const router = require("express").Router();
const user = require("../models/User");
const Cart = require("../models/Cart")
const { verifyTokenAuth,verifyToken, verifyTokenAdmin} = require("./verifyToken")
//CREATE PRODUCT
router.post("/",verifyToken, async (req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json(error)
    }
})

 //UPDATE USER INFORMATION
 router.put("/:id", verifyTokenAuth, async(req, res) => {
  // Before updating check passsword and ecrypt
  
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            //set the new information
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
});

//DELETE
router.delete("/:id", verifyTokenAuth, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json(`Cart deleted`)
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET USER CART
router.get("/find/:id",verifyTokenAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id })
       res.status(200).json({cart});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
// //GET ALL PRODUCTS
router.get("/",verifyTokenAdmin, async (req, res) => {
try {
    const carts = await Cart.find()
    res.status(200).json(carts)
} catch (error) {
    res.status(500).json(error)
}
})



module.exports = router