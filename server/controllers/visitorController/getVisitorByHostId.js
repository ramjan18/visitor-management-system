const  Visitor = require("../../models/visitor");

const getVisitorByHostId = async (req , res) => {

    try {
        
        const {id} = req.params;
        console.log(req.user);
        
    const allVisitors = await Visitor.find({personToMeet : id});

    if (!allVisitors) {
        return res.json({
            message : "No data found"
        })
    }
    

    return res.status(200).json({
        message : "Visitors fetched successFully",
        allVisitors
    })
    } catch (error) {
        return res.status(500).json({
            message : "Failed to fetch visitors",

        })
    }
    
}

module.exports= {getVisitorByHostId};