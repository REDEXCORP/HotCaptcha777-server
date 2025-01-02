const bcrypt = require('bcryptjs');
const UserModel = require("../models/userModel");

const resetUserPassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        const user = await UserModel.findById(req.tokenUser.userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect old password." });
        }

        user.password = newPassword;

        await user.save();

        res.status(200).json({ message: "Password reset successful." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = resetUserPassword;
