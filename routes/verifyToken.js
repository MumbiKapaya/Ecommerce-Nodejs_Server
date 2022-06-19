const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWSECRETEKEY, (err, user) => {
            if (err) res.status(403).json("Token is invalid");
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json("Not authenticated")
    }
}
const verifyTokenAuth = (req, res, next) => {
    verifyToken(req, res, () => {
        //if its the user or the admin then cahnages can be made
        if (req.user.id === req.params.id || req.user.isAdmin) { 
            next();
        } else {
           res.status(403).json("UnAuthorised operation") 
        }
    })
}
const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //if its the user or the admin then cahnages can be made
        if (req.user.isAdmin) { 
            next();
        } else {
           res.status(403).json("UnAuthorised operation") 
        }
    })
}
module.exports = { verifyToken, verifyTokenAuth,verifyTokenAdmin };