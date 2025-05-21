const User = require("../../models/user");
const bcrypt = require("bcrypt");

const signUp = async(req , res) => {
    try {
        const {name , email , password , role , phoneNo} = req.body;

        const user = await User.findOne({email : email});

        if(user){
            return res.status(406).json({
                message : "User already registered with this email"
            })
        }

        if(!name || !email || !password || !role || !phoneNo){
            return res.status(400).json({
                message : "All Fields are required"
            })
        }


        const hashedPassword = await bcrypt.hash(password , 10);  

        const newUser = await User.create({
            name,
            email,
            phoneNo,
            password : hashedPassword,
            role
        })

        return res.status(200).json({
            message : "User Created Successfully",
            newUser
        })

    } catch (error) {
        return res.status(500).json({
            message : "Failed to create user"
        })
    }
}

module.exports = {signUp};