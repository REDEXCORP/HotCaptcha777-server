const mongoose = require('mongoose');
const dbConnection = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Unable to connect MongoDB", error));
};

module.exports = dbConnection;