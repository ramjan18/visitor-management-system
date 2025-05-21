const jwt = require("jsonwebtoken");

const auth = async(req , res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        if(!token){
            return res.status(404).json({
                message : "Token must be required"
            })
        }
    
        const decode = jwt.verify(token , process.env.JWT_SECRETE);
        
        next()
    } catch (error) {
        return res.status(500).json({
            message : "Failed to verify token"
        })
    }
   
}

module.exports = {auth} ;