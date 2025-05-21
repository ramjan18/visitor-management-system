const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connect = require("./config/db");


const app = express();
app.use(express.json());
dotenv.config();
app.use(express.urlencoded({ extended: true }));


app.use(cors());


connect();


app.get('/', (req , res) =>{
    res.send("hello")
})


const visitorRoutes = require("./routes/visitorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const hostRoutes = require("./routes/hostRoutes")
const authRoutes = require("./routes/authRoutes");

app.use("/api", visitorRoutes);
app.use("/api", adminRoutes);
app.use("/api",hostRoutes );
app.use("/api",authRoutes );
app.listen(5000, ()=>{
    console.log("app is running on port 5000");
    
})

