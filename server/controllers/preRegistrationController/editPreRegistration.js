const preRegister = require("../../models/preRegistration");

const editPreRegistration = async (req ,res) => {

    try {
        const {visitorName , email, phone , personToMeet , date , time , purpose , status, id } = req.body;

        const reg = await preRegister.find({_id : id});
        
        if(!reg) {
            return res.status(404).json({
                message : "Registration not found"
            })
        }
    
        const updatedReg = await preRegister.findByIdAndUpdate(id , {
            visitorName,
            email,
            phone,
            personToMeet,
            date,
            time,
            purpose,
            status
        })
    
        return res.status(201).json({
            message : "Updated successfully",
            updatedReg
        })
    } catch (error) {
        return res.status(500).json({
            message : "failed to update ",
            
        })
    }

   
}

module.exports = {editPreRegistration};

