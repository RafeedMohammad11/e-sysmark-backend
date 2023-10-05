// const Joi = require('joi');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { roles } = require("../globalVars");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    maxlength: [255, "Name cannot be more than 255 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    maxlength: [255, "Email cannot be more than 255 characters"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },

  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minLength: [11, "Phone number cannot be less than 11 characters"],
    maxlength: [11, "Phone number cannot be more than 11 characters"],
    trim: true,
    unique: true,
    validate: {
      validator: function (phoneNumber) {
        return /^[0-9]{11}$/g.test(phoneNumber);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minLength: 4,
    maxlength: 1024,
  },
  role: { type: String, enum: roles, default: "applicant" },
});

userSchema.methods.generateAuthToken = function () {
  const accessToken = jwt.sign(
    { _id: this._id, _email: this.email, name: this.name, role: this.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  return accessToken;
};

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };