require("dotenv").config();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.error("Fatal Error: access token is not defined!");
  process.exit(1);
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      status: "success",
      results: users.length,
      data: { users },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failure",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    let duplicateEmail = await User.findOne({ email: req.body.email });
    let duplicatePhone = await User.findOne({ phone: req.body.phone });

    if (duplicateEmail)
      throw new Error("User already registered with the email in RecruitX");
    if (duplicatePhone)
      throw new Error("User already registered with the phone no. in RecruitX");

    let user = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const accessToken = user.generateAuthToken();
    res
      .header("access-token", accessToken)
      .status(201)
      .json({
        accessToken: "Bearer " + accessToken,
        status: "success",
        message: "User has been created successfully!",
      });
  } catch (error) {
    res.status(400).json({
      status: "Failure",
      error: error.message,
    });
  }
};

const authenticateUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User email or password is incorrect");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) throw new Error("User email or password is incorrect");

    const accessToken = user.generateAuthToken();
    res
      .header("Authorization", "Bearer " + accessToken)
      .status(200)
      .json({
        accessToken: "Bearer " + accessToken,
        status: "success",
        message: "User logged in successfully!",
      });
  } catch (error) {
    res.json({
      status: "Failure",
      error: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("No user created using this email");

    if (!req.userData["_id"] === req.params.id) {
      throw new Error("You are not authorized to update");
    }

    let oldPassword = req.body.oldPassword;
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword)
      throw new Error(
        "Your old password is incorrect. You cannot reset your password."
      );
    else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.newPassword, salt);
      res.status(200).json({
        status: "success",
        message: "Password was reset successfully!",
      });
      await user.save();
    }
  } catch (error) {
    res.status(400).json({
      status: "Failure",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const isValidUser = await User.findById(req.params.id);
    if (!isValidUser) throw new Error("No User found");
    const user = await User.findByIdAndDelete(id).select("-password");
    res.status(200).json({
      status: "success",
      message: "User deleted successfully!",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failure",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const isValidUser = await User.findById(id).select("-password");

    if (!isValidUser) throw new Error("User with the given ID not found");
    let user;
    if (req.body.job) {
      user = await User.findByIdAndUpdate(
        id,
        { $push: { appliedJobs: req.body.job } },
        {
          new: true,
        }
      ).select("-password");
    } else {
      user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      }).select("-password");
    }

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      status: "Failure",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  authenticateUser,
  deleteUser,
  updateUser,
  resetPassword,
  getAllUsers,
};