const express = require("express");
const CommentRouter = express.Router();
const commentController = require("../Controllers/commentController");
const auth = require("../middleware/auth");

CommentRouter.post("/addComment", auth, commentController.addComment);
//CommentRouter.post("/dummy_addCommentReply", auth, commentController.CommentRouter.dummy_addCommentReply);
CommentRouter.post("/addReply", auth, commentController.addReply);
CommentRouter.put("/updateComment/:id", auth, commentController.updateComment);
CommentRouter.delete(
  "/deleteComment/:id",
  auth,
  commentController.deleteComment
);
CommentRouter.get("/getAllComments", auth, commentController.getAllComments);

module.exports = CommentRouter;
