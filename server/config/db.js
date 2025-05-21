const mongoose = require("mongoose");

const connect = ()=>{
    try {
        mongoose.connect(process.env.MONGO_URL).then(()=>{
            console.log("Connected to database");
            
        })
        
    } catch (error) {
      console.log("database connection Failed");
        
    }
    
}

module.exports = connect