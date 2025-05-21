const mongoose = require("mongoose");

const registrationSchema =new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    photo : {
        type : String,
        // required : true
    },
     phoneNo: {
        type : String,
        required : true
    },
    personToMeet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    purpose : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["Pending" , "Approved" , "Rejected"],
        default : "Pending"
    },
    typeOfVisitor : {
        type : String,
        required : true
    },
    checkInTime : {
        type : Date,
        default : Date.now
    },
    checkOutTime : {
        type : Date,
    },
    meetingTime : {
        type : Date
    }

   
},
{
    timestamps : true
});

const Visitor = mongoose.model("Visitor", registrationSchema);
module.exports = Visitor;