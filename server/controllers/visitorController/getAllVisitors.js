const Visitor = require("../../models/visitor");

const getAllVisitors = async (req , res ) =>{
    try {
        const allVisitors = await Visitor.find({})
        .populate("personToMeet");

        if(!allVisitors) {
            return res.json({
                message : "No data found"
            })
        }

        return res.status(201).json({
            message : "Data fetched successfully",
            allVisitors
        })
    } catch (error) {
        return res.status(500).json(
            {
                message : "Failed to fetch"
            }
        )
    }
}


module.exports = {getAllVisitors}