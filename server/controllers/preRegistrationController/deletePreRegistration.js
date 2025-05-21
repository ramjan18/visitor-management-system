const preRegister = require("../../models/preRegistration");

const deletePreReg = async (req , res) => {
    const {id} = req.params;

    const deletedReg = await preRegister.findByIdAndDelete(id);

    return res.status(200).json({
        message : "deleted Successfully",
        deletePreReg
    })
   
}

module.exports = {deletePreReg}