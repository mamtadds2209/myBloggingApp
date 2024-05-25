const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    message: { type: String },
    commentorId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    blogpostId: { type: mongoose.Schema.Types.ObjectId, ref: "blog" },
    reply: [
      {
        reply_msg: { type: String },
        replierId: { type: String },
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
