const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
  },
  city: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Author", "Reader"],
    default: "Admin",
  },
});

module.exports = mongoose.model("user", userSchema);
