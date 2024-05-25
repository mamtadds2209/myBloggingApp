const User = require("../Models/user.js");
const Blog = require("../Models/blog.js");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.js");
require("dotenv").config();

//console.log(User);
//app.post("/register", async (req, res) => {

//User registration Endpoint
exports.register = async (req, res) => {
  try {
    const { name, email, city, password, role } = req.body;
    //console.log(" body ==> ", req.body);

    //validate the user

    if (!(name && email && city && password && role)) {
      return res
        .status(400)
        .send({ success: false, message: "All inputs are required" });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(401).json({
        success: false,
        message: "Please enter a valid email address!",
      });
    } else if (!password || password.length < 8) {
      return res.status(400).send({ message: "Invalid password" });
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists. Register again.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    // new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      city,
      role,
      password: hashedPassword,
    });
    newUser.save();
    return res
      .status(200)
      .send({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, message: "Error occured" });
  }
};

// User                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          login Endpoint

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log(req.body);

    if (!(email && password)) {
      return res
        .status(400)
        .send({ success: false, message: "All inputs are required" });
    }

    // check if email and password exists or not

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(400).send({
        success: false,
        message: "Wrong email, Please enter right email!",
      });
    }

    const compare_password = await bcrypt.compare(password, validUser.password);

    if (!compare_password) {
      return res
        .status(400)
        .send({ sucess: false, message: "Password is invalid!" });
    }
    //console.log("process.env.PRIVATE_KEY", process.env.PRIVATE_KEY);

    var token = jwt.sign({ id: validUser._id }, process.env.PRIVATE_KEY);

    console.log("login successful:", compare_password);
    return res
      .status(200)
      .send({ success: true, token, message: "login successful" });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong!", error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user_Id = req.userId;
    //console.log(user_Id);

    if (!user_Id) {
      // used when data comes in object form
      return res
        .status(400)
        .send({ success: false, message: "User doesn't exist." });
    }

    const user = await User.findById(user_Id);
    //console.log(user);

    const posts = await Blog.find({ author: user_Id });
    //console.log(posts);

    if (posts.length === 0) {
      // used when data comes in array form
      return res
        .status(401)
        .send({ success: false, message: "No blogpost by this user exists." });
    }
    return res.send({ user, posts });
  } catch (error) {
    //console.log("error==>", error);
    return res
      .status(500)
      .send({ success: false, message: "error occured", error });
  }
};

// exports.demo = async (req, res) => {
//   try {
//     const userID = req.userId;
//     console.log("object", req.userId);
//     return res
//       .status(200)
//       .send({ success: true, userID, message: "login successful" });
//   } catch (error) {
//     console.log("error", error);
//     return res
//       .status(500)
//       .send({ success: false, message: "Something went wrong!", error });
//   }
// };
