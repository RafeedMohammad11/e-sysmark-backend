const { json } = require("express");
const path = require("path");
const users = require("./routes/users");
const products = require("./routes/products");

const auth = require("./routes/auth");

const express = require("express");
const mongoose = require('mongoose');
const app = express();
app.use(express.static('uploads'));


require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Hello E-Sysmark");
});

mongoose.set("strictQuery", false);
app.use(json());


//API endpoints for users
//Functionalities: POST: user, PATCH: user, DELETE: user, POST: login/authentication
app.use("/api/users", users); //Registration
app.use("/api/auth", auth); //Login

//API endpoints for products
app.use("/api/products", products); //Products


mongoose
  .connect("mongodb://127.0.0.1:27017/eSysmark")
  .then(()=> console.log("Connected to mongo db"))
  .catch((err) => console.log(err.message));

app.use(express.json());


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server runnning at http://localhost:${port}`));

module.exports = app;

