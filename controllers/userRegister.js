const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const UserOtpModel = require("../models/userOtpModel");

const userRegister = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const ifUserExist = await UserModel.findOne({ email })
    if(ifUserExist) {
      return res.status(409).json({ message: "User already exist, Please try login" });
    }
    
    const sentOtp = await UserOtpModel.findOne({ email, type : "userRegister" });
    if (!sentOtp) {
      return res.status(409).json({ message: "OTP is not valid or expired" });
    }

    if (sentOtp.otp !== otp) {
      return res.status(409).json({ message: "OTP is not valid" });
    }

    const userRegister = new UserModel(req.body);
    await userRegister.save();

    const token = jwt.sign(
      { userId: userRegister._id, email: userRegister.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2592000000,
    });

    await UserOtpModel.deleteOne({ email, type : "userRegister" });
    
    return res.status(201).json({ message: "User successfully registered" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = userRegister;
