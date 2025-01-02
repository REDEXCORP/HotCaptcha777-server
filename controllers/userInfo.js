const UserModel = require("../models/userModel");

const userInfo = async (req, res) => {
    try {
        const user = await UserModel.findById(req.tokenUser.userId);
        if (!user) {
            return res.status(409).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = userInfo;
