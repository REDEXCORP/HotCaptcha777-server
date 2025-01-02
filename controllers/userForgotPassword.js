const UserModel = require("../models/userModel");
const UserOtpModel = require("../models/userOtpModel");

const userForgotPassword = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        const sentOtp = await UserOtpModel.findOne({ email, type: "forgotPassword" });
        if (!sentOtp) {
            return res.status(409).json({ message: "OTP is not valid or expired" });
        }

        if (sentOtp.otp !== otp) {
            return res.status(409).json({ message: "OTP is not valid" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = password;
        await user.save();

        await UserOtpModel.deleteOne({ email, type: "forgotPassword" });

        return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = userForgotPassword;
