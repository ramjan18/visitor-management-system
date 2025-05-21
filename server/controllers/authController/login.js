const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

const login = async (req, res) => {
  const { email, password } = req.body;

  
  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User is not registered with this email"
      });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRETE,
      { expiresIn: "1d" }
    );

    req.user= user;
 
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login"
    });
  }
};

module.exports = {
  login
};
