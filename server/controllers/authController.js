const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Register
exports.register = async (req,res)=>{
    try {
        const { name, email, password }=req.body;

        if(!name || !email ||!password){
            return res.status(400).json({ message: "All field are required "});
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(400).json({ message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user=await User.create({
            name,
            email,
            password:hashedPassword,
        });

        res.status(201).json({
            message:"User registered successfully",
            userId:user._id,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error "});
        
    }
};
exports.login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user ? "YES" : "NO");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("TOKEN CREATED");
res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (https)
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

res.json({
  message: "Login successful",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
