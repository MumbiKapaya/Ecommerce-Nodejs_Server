const router = require("express").Router();
const Order = require("../models/Order")
const { verifyTokenAuth, verifyTokenAdmin, verifyToken} = require("./verifyToken")
//CREATE PRODUCT
router.post("/",verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json(error)
    }
})

//UPDATE ORDER INFORMATION
 router.put("/:id", verifyTokenAdmin, async(req, res) => {
  // Before updating check passsword and ecrypt
  
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            //set the new information
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
});

//DELETE
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json(`Order deleted`)
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET USER ORDER
router.get("/find/:userId",verifyTokenAuth, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.id })
       res.status(200).json({order});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
// //GET ALL ORDERS
router.get("/",verifyTokenAdmin, async (req, res) => {
try {
    const orders = await Order.find()
    res.status(200).json(orders)
} catch (error) {
    res.status(500).json(error)
}
})
//GET MONTHLY INCOME
router.get("/income", verifyTokenAdmin, async(req, res) => {
      //get the dates 
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
    const prevMonth = new Date( new Date().setMonth(lastMonth .getMonth() - 1))
    try {
        const income = await Order.aggregate([
        
            { $match: { createdAt: { $gte: prevMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales:"$amount",
                }
            },
            {
                $group: {
                    _id: "$month",
                    total:{$sum:"$sales"}
                }
            }
        ])
        res.status(200).json(income)
    } catch (error) {
       res.status(500).json(error) 
    }
})



module.exports = router