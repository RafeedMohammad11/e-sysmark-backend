const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  updateUser,
  resetPassword,
  getAllUsers,
} = require("../controllers/user");

const { checkAuth, checkAdminOrManager } = require("../middlewares/check-auth");
const { adminRoles } = require("../globalVars");

router.get("/", async (req, res) => {
  const users = await User.find().sort("name");
});

router.post("/", createUser);
router.get(
  "/get-users",
  [checkAuth, checkAdminOrManager(adminRoles)],
  getAllUsers
);
router.delete("/:id", [checkAuth, checkAdminOrManager(adminRoles)], deleteUser);
router.patch("/:id", [checkAuth, checkAdminOrManager(adminRoles)], updateUser);
router.patch("/:id/reset", checkAuth, resetPassword);

module.exports = router;