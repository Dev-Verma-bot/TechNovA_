const express = require("express");
const router = express.Router();

const userController = require("../Controllers/User");
const auth = require("../Middlewares/Auth");

router.get("/profile", auth, userController.getProfile);
router.put("/update", auth, userController.updateProfile);

module.exports = router;