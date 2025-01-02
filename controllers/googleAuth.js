const UserModel = require("../models/userModel");
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, given_name, family_name } = payload;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        email,
        name: `${given_name} ${family_name}`,
        authSource: 'google',
      });
    }

    const token = jwt.sign({ userId: user._id, email: user.email },  process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });

    res
      .status(200)
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000,
      })
      .json({ message: 'Authentication successful', user });
  } catch (err) {
    console.error('Error during Google Authentication:', err);
    res.status(400).json({ error: 'Authentication failed', details: err });
  }
};

module.exports = googleAuth;
