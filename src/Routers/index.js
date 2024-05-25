const express = require("express");
const UserRouter = require("./userRouter");
const BlogRouter = require("./blogRouter");
const CommentRouter = require("./commentRouter");

const apiRoutes = express.Router();

apiRoutes.use("/user", UserRouter);
apiRoutes.use("/blog", BlogRouter);
apiRoutes.use("/comment", CommentRouter);

module.exports = apiRoutes;
