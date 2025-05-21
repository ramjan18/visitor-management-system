const User = require("../../models/user");

const getUserById = async (req , res) =>{

    try {
        const {id} = req.params;
    
        const user = await User.findById(id);
    
        if (!user) {
            return res.status(404).json({
                message : "User Not Found"
            })
        }
    
        return res.status(200).json({
            message : "user data fetched succefully",
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Failed to fetch user data",
        
        })
    }

}

module.exports = {getUserById};