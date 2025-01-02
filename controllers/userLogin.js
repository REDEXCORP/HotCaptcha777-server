const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');
    if(!user) {
        return res.status(409).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
        { userId: user._id, email: email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '30d' }
    );

    res.cookie("auth_token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 2592000000,
    });
    
    return res.status(200).json({ message: "logged in successfully" });
};

module.exports = userLogin;