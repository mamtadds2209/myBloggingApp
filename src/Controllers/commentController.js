const mongoose = require("mongoose");
const express = require("express");
const Comment = require("../Models/comment.js");
const User = require("../Models/user.js");
const dotenv = require("dotenv");

dotenv.config();

exports.addComment = async (req, res) => {
  try {
    const { message, reply } = req.body;

    const { reply_msg, replierId } = reply;
    //console.log(replierId);
    const commentorId = req.userId;
    const blogpostId = req.body._id;
    //const reply = req.body.reply;
    const commentReply = {
      reply_msg,
      replierId,
      _id: new mongoose.Types.ObjectId(),
    };
    //console.log(commentReply.replierId);
    const newComment = new Comment({
      message,
      commentorId,
      blogpostId,
      reply: commentReply,
    });
    //console.log(newComment);

    const result = await newComment.save();
    console.log("comment=>", result);

    return res.status(200).send({
      success: true,
      message: "Comment created successfully.",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ success: false, message: "Error occured", error });
  }
};

// exports.addComment = async (req, res) => {
//     try {
//       const { message, reply } = req.body;
//       console.log("console=>", req.body);

//       const commentor = req.userId;
//       const blogpost = req.body._id;

//       const newComment = new Comment({
//         message,
//         commentor,
//         blogpost,
//         reply,
//       });

//       const result = await newComment.save();
//       console.log("comment=>", result);

//       return res.status(200).send({
//         success: true,
//         message: "Comment created successfully.",
//         result,
//       });
//     } catch (error) {
//       console.log(error);
//       return res
//         .status(400)
//         .send({ success: false, message: "Error occured", error });
//     }
//   };
//
// Reply Endpoint

exports.addReply = async (req, res) => {
  try {
    const { reply_msg, _id } = req.body;
    const commentorId = req.userId;
    //const commentId = req.user._id;

    const commentReply = {
      reply_msg,
      commentorId,
      _id: new mongoose.Types.ObjectId(), // comment Id
    };

    const comment = await Comment.findById(_id);

    if (!comment) {
      return res
        .status(500)
        .send({ success: false, message: "Comment not found" });
    }

    comment.reply.push(commentReply);

    const result = await comment.save();

    //const commentReplyResult = await commentReply.save();
    //console.log("Reply=>Reply added", commentReplyResult);

    return res.status(200).send({
      success: true,
      message: "Reply added successfully.",
      result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ success: false, message: "Error occured", error });
  }
};

// UPDATE ENDPOINT

exports.updateComment = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    const commentId = req.params.id;
    const commentData = await Comment.findById({ _id: commentId });
    if (!commentData) {
      return res.status(400).send({ message: "No comments found." });
    }
    const commentorId = String(commentData.commentorId); // can also use .toString() method
    //console.log(commentorId);
    if (userId !== commentorId) {
      return res
        .status(400)
        .send({ message: "You are not authorized to edit this comment." });
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { message: req.body.message },
      { new: true }
    ).lean();

    //console.log(updatedComment);

    return res.status(200).send({
      success: true,
      message: "Comment updated successfully.",
      updatedComment,
    });
  } catch (error) {
    //console.log("error==>", error);
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong.", error });
  }
};

// DELETE ENDPOINT

exports.deleteComment = async (req, res) => {
  try {
    const userId = req.userId;
    const _id = req.params.id;

    //console.log("comment id ====", _id);
    const findComment = await Comment.findById({ _id });
    const commentorId = String(findComment.commentorId);
    console.log(findComment);
    if (!findComment) {
      return res.status(400).send({
        success: false,
        message: "Not data.!",
      });
    }
    if (userId !== commentorId) {
      return res
        .status(400)
        .send({ message: "You are not authorized to delete this comment." });
    }
    await Comment.findByIdAndDelete({ _id }).lean();
    const data = await Comment.find().lean();
    return res.status(200).send({
      success: true,
      data: data,
      message: "Comment deleted successfully..!",
    });
  } catch (error) {
    console.log("error====>", error);
    return res.status(500).send({
      success: false,
      error,
      message: "Something went wrong!",
    });
  }
};

// getAllComments Endpoint / Pagination and Sorting

exports.getAllComments = async (req, res) => {
  try {
    // destructure page and limit and set default values
    const { page, limit } = req.query;

    const commentData = await Comment.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 })
      .sort({ reply: 1 });
    //createdAt=1 sorts date in increasing order while reply=-1 sorts in decreasing order

    const commentCount = await Comment.countDocuments();
    if (!commentData) {
      return res
        .status(500)
        .send({ success: false, message: "Data not found" });
    }
    return res.status(200).send({
      success: true,
      commentData: commentData,
      currentPage: page,
      totalPages: Math.ceil(commentCount / limit),
    });
  } catch (error) {
    console.log("error=>", error);
    return res
      .status(400)
      .send({ success: false, message: "Error occured", error });
  }
};
