const preRegister = require("../../models/preRegistration");

const getPreRegistrationById = async (req , res) => {

    try {
        const {id} = req.params;

        const preReg = await preRegister.findById(id);
    
        if(!preReg){
            return res.status(404).json({
                message : "Registration not found"
            })
        }
    
        return res.status(200).json({
            message : "data fetched successfully",
            preReg
        })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to fetch data"
        })
    }

   
}

module.exports = {getPreRegistrationById}