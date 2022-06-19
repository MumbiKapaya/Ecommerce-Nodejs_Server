const User = require("../models/User")

const router = require("express").Router();
const CryptoJS = require("crypto-js")
const jsonWebToken = require("jsonwebtoken");
//register a user
router.post("/register", async(req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORDSECREAT).toString(),
    });
    try {
   const savedUser =  await newUser.save() 
   res.status(201).json(savedUser)
    } catch (error) {
       res.status(500).json(error)
    }
})
//login 
router.post("/login",async (req, res) => {
   try {
       const user = await User.findOne({ username: req.body.username });
       !user && res.status(401).json("User not registered");
       //decrypt the hashed password
       const decrptedPassword = CryptoJS.AES.decrypt(
           user.password,
           process.env.PASSWORDSECREAT
       );
        //convert to string
    const  userpassword = decrptedPassword.toString(CryptoJS.enc.Utf8);
       userpassword !== req.body.password &&
           res.status(401).json("Wrong password");
           const accessToken = jsonWebToken.sign({
            id: user._id, isAdmin: user.isAdmin,
       }, process.env.JWSECRETEKEY,
       {expiresIn:"3d"});
     //if all is okay then return the password
    const { password, ...others } = user._doc; 
       res.status(200).json({ ...others, accessToken });
   } catch (error) {
       res.status(500)
   } 
})

module.exports = router