import mongoose from "mongoose";
import commentSchema from "./Comment.model.js";
const PostSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  picture: String,
  isDeleted: {
    type: Boolean,
    default: false,
  },
  picture: String,
},{timestamps:true});
const PostModel = mongoose.model("Post", PostSchema);
export default PostModel;
