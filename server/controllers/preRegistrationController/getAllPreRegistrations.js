const preRegister = require("../../models/preRegistration");

const getAllPreRegistrations = async (req,res) => {
    try {
        const AllRegistrations = await preRegister.find()
        .populate("personToMeet" , "name email");

        if(!AllRegistrations){
            return res.status(404).json({
                message : "Data not found"
            })
        }

        return res.status(200).json({
            message : "Data fetched successfully",
            AllRegistrations
        })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to get data"
        })
    }
}


module.exports = {getAllPreRegistrations}