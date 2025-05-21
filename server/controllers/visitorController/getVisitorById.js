const Visitor = require("../../models/visitor");

const getVisitorById = async (req,res) => {
    const {id} = req.params ;

    const visitor = await Visitor.findById(id);

    if(!visitor) {
        return res.status(404).json({
            message : "Visitor not found"
        })
    }

    return res.status(200).json({
        message : "Visitor fetched successfully",
        visitor
    })
}

module.exports = {getVisitorById} ;