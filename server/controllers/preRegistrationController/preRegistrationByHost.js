const preRegister = require("../../models/preRegistration");

const preRegistrationByHost = async(req , res) => {

    try {
        const {id} = req.params;

    const registrations = await preRegister.find({personToMeet : id});

    return res.status(200).json({
        message : "data frtched successfully",
        registrations
    })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to fetch data",
            
        })
    }
    
}

module.exports = {preRegistrationByHost};