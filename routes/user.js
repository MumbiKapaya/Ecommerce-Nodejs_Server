const router = require("express").Router();
const user = require("../models/User");
const User = require("../models/User")
const { verifyTokenAuth, verifyTokenAdmin} = require("./verifyToken")
//UPDATE USER INFORMATION
router.put("/:id", verifyTokenAuth, async(req, res) => {
    //Before updating check passsword and ecrypt
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORDSECREAT
        ).toString();
    }try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            //set the new information
            $set: req.body
        }, { new: true }
        );
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
});

//DELETE
router.delete("/:id", verifyTokenAuth, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json(`user ${User.username} deleted`)
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET USER
router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
         const { password, ...others } = user._doc; 
       res.status(200).json({...others});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET ALL USER
router.get("/", verifyTokenAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find(); 
       res.status(200).json({users});
    } catch (error) {
        res.status(500)
        res.json(error)
    }
})
//GET USER STATS
router.get("/stats", verifyTokenAdmin, async (req, res) => {
   //get the dates 
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))
    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month:"$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month",
                    total:{$sum:1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (error) {
       res.status(500).json(error) 
    }
})


module.exports = router