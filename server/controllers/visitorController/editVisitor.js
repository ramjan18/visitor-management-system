const Visitor = require("../../models/visitor");

const editVisitor = async(req , res) => {

    try {


        
        const {name , email , phoneNo , personToMeet  , purpose , checkOutTime , id , typeOfVisitor  } = req.body;

        if(!id){
            return res.status(404).json({
                message : " Id must be required "
            })
        }

    const updatedVisitor  = await Visitor.findByIdAndUpdate(id , {
        name,
        email,
        phoneNo,
        personToMeet,
        purpose,
        checkOutTime,
        typeOfVisitor
    })

    return res.status(201).json({
        message : "Updated succefully",
        updatedVisitor
    })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to update",
        
        })
    }

    
}

module.exports = {editVisitor}