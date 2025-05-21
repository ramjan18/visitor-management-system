const mongoose = require("mongoose");

const preRegistraionSchema = new mongoose.Schema({
    visitorName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        required : true
    },
    time : {
        type : String
    },
    purpose : {
        type : String
    },
    phone : {
        type : String
    },
    status : {
        type : String,
        enum : ["pending" , "approved" , "rejected"],
        default : "pending"
    },
    personToMeet : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
},
{
    timestamps : true
})

const preRegistration = mongoose.model("preRegistration" , preRegistraionSchema);

module.exports = preRegistration;