const formData = require("form-data");
const Mailgun = require("mailgun.js");
const fs = require("fs");
const path = require("path");
const UserOtpModel = require("../models/userOtpModel");
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const userOtp = async (req, res) => {
  try {
    const { email, type } = req.body;
    
    const checkIfExist = await UserOtpModel.findOne({ email, type });

    if (checkIfExist) {
      const currentTime = Date.now();
      const expiryTime = checkIfExist.createdAt.getTime() + 5 * 60 * 1000;

      if (currentTime < expiryTime) {
        const remainingTime = Math.ceil((expiryTime - currentTime) / 60000);
        return res.status(409).json({ 
          message: `OTP already sent. Please check your inbox or try again after ${remainingTime} minute(s).` 
        });
      }
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000);

    const otp = new UserOtpModel({
      email,
      otp: generatedOtp,
      type,
    });

    const templatePath = path.join(__dirname, "../templates/userOtp.html");
    let emailHtml = fs.readFileSync(templatePath, "utf-8");

    emailHtml = emailHtml.replace("{{otp}}", generatedOtp);

    await mg.messages.create(process.env.MAILGUN_USERNAME, {
      from: process.env.FROM_EMAIL,
      to: [email],
      subject: type === "forgotPassword" ? "Your forgot password OTP" : "Your Registration OTP",
      text: `Your OTP for ${ type === "forgotPassword" ? 'forgot password' : 'Registration' } is: ${generatedOtp}`,
      html: emailHtml,
    });
    await otp.save();
    return res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

module.exports = userOtp;