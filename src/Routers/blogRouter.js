const express = require("express");
const BlogRouter = express.Router();
const blogController = require("../Controllers/blogController");
const auth = require("../middleware/auth");

BlogRouter.post("/addBlog", auth, blogController.addBlog);
BlogRouter.put("/updateBlog/:id", auth, blogController.updateBlog);
BlogRouter.delete("/deleteBlog/:id", auth, blogController.deleteBlog);
BlogRouter.get("/getAllBlogs", auth, blogController.getAllBlogs);

module.exports = BlogRouter;
