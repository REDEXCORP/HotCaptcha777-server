require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const dbConnection = require("./services/db");
const routes = require('./routes');

dbConnection();

const allowedHost = ['localhost:5000'];

const allowSpecificHost = (req, res, next) => {
  const host = req.get('host');
  if (allowedHost.includes(host)) {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden' });
};

app.use(allowSpecificHost);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cors());

app.use('/api', routes);

app.get("*", (req, res) => {
  return res.status(404).send("Page not found");
});

app.listen(5000, () =>
  console.log(`Server listening on http://localhost:5000`)
);