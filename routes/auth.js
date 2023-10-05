const express = require('express');

const { authenticateUser } = require("../controllers/user");
const router = express.Router();



router.post('/', authenticateUser);
module.exports = router; 