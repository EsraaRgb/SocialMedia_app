import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

    body:{
        type: String,
        required: true,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "User"
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted:{
        type: Boolean,
        default: false
    },
    deletedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    replies: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment"}],

},{timestamps:true})

const CommentModel = mongoose.model('Comment',commentSchema)
export default CommentModel
