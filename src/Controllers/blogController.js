const express = require("express");
//const Router = express.Router();
const Blog = require("../Models/blog.js");
const User = require("../Models/user.js");
const auth = require("../middleware/auth.js");
const dotenv = require("dotenv");
dotenv.config();

// add blog Endpoint

exports.addBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    //console.log(req.body);

    const authorId = req.userId;

    const newBlog = new Blog({
      title,
      content,
      author: authorId,
    });

    await newBlog.save();

    return res
      .status(200)
      .send({ success: true, message: "Blog added successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(400).send({ success: false, message: "Error occcured", error });
  }
};

// update blog endpoint

exports.updateBlog = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const blogId = req.body.blogId;
    console.log(blogId);
    const user = await User.findById({ _id: userId });
    //console.log(user);
    if (user.role === "Reader") {
      //console.log("ifffffff ==> ");
      return res
        .status(404)
        .json({ code: 404, message: "You are unable to access this." });
    }

    //console.log("elseeee =:> ");
    //const _id = req.body._id;
    //console.log(req.body);

    const findData = await Blog.findById({ _id: blogId });

    //console.log("findData");
    if (!findData) {
      return res
        .status(400)
        .status({ success: false, message: "No data found" });
    }

    const newdata = await Blog.findByIdAndUpdate(
      { _id: blogId },
      { ...req.body },
      { new: true } // responsible for updating the data at the time of response after data is updated in db.
    ).lean();

    return res.status(200).send({
      success: true,
      message: "Blog post updated successfully.",
      newdata,
    });
  } catch (error) {
    //console.log("error==>", error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong.", error });
  }
};

// delete blog endpoint

exports.deleteBlog = async (req, res) => {
  try {
    const blogId = req.body._id;
    //console.log(req.body);
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    if (user.role === "Reader")
      return res
        .status(401)
        .send({ message: "You don't have access to this." });

    const findData = await Blog.findById({ _id: blogId });

    if (!findData) {
      return res
        .status(400)
        .status({ success: false, message: "No data found" });
    }

    await Blog.findByIdAndDelete({ _id: blogId }).lean();

    const data = await Blog.find().lean();

    return res.status(200).send({
      success: true,
      message: "Blog deleted successfully.",
      data,
    });
  } catch (error) {
    console.log("error==>", error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong.", error });
  }
};

// getAllBlogs endpoint / Pagination & Sorting

exports.getAllBlogs = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page, limit } = req.query;

    const data = await Blog.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort("createdAt");

    const blogCount = await Blog.countDocuments();
    if (!data) {
      return res
        .status(500)
        .send({ success: false, message: "Data not found" });
    }
    return res.status(200).send({
      success: true,
      data: data,
      currentPage: page,
      totalPages: Math.ceil(blogCount / limit),
    });
  } catch (error) {
    console.log("error=>", error);
    return res
      .status(400)
      .send({ success: false, message: "Error occured", error });
  }
};
