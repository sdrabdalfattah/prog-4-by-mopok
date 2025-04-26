const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  googleId: String,
  user_name: String,     
  user_photo: String,   
  post_content: String,
  post_photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);