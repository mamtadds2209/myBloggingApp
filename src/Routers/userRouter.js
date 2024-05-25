const express = require("express");
const UserRouter = express.Router();
const userController = require("../Controllers/userController");
const auth = require("../middleware/auth");

UserRouter.post("/register", userController.register);
UserRouter.post("/login", userController.login);
UserRouter.get("/getUserProfile", auth, userController.getUserProfile);
// UserRouter.post("/demo", auth, userController.demo);

module.exports = UserRouter;
