import CommentModel from "../../../DB/Models/Comment.model.js";
import UserModel from "../../../DB/Models/User.model.js";
import PostModel from "../../../DB/Models/Post.model.js";

export const addComment = async (req, res) => {
  try {
    const { body } = req.body;
    const newComment = new CommentModel({
      body,
      createdBy: req.user._id,
      postId: req.params.id,
    });
    const product = await PostModel.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      {
        $push: { comments: newComment._id },
      }
    );
    if (product) {
      const savedComment = await newComment.save();
      res.status(201).json({ comment: savedComment });
    } else {
      res.status(404).json({ message: "In-valid post Id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const updatedComment = await CommentModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id, isDeleted: false },
      { body: body },
      { new: true }
    );
    if (updatedComment) {
      res.status(202).json({ message: "Done", updatedComment });
    } else {
      res.status(404).json({ message: "Wrong Comment Id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

export const softDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userPosts = await UserModel.findById(userId).select("posts");
    const result = await CommentModel.findOneAndUpdate(
      {
        _id: id,
        $or: [
          { createdBy: req.user._id },
          { postId: { $in: userPosts.posts } },
        ],
        isDeleted: false,
      },
      { isDeleted: true, deletedBy: req.user._id },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(404).json({
        message:
          "Wrong comment Id or you are Not authorized To Delete This Comment",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await CommentModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: { $ne: req.user._id },
        likes: { $nin: req.user._id },
      },
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    if (result) {
      res.status(201).json({ result });
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to like the Comment",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const CommentReplay = async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;
  const replay = await new CommentModel({
    body,
    createdBy: req.user._id,
  }).save();
  const comment = await CommentModel.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { $push: { replies: replay } },
    { new: true }
  );
  comment ? res.json({ comment }) : res.json({ message: "wrong comment id" });
};
export const ReplayOnReplay = async (req, res) => {
  const { id, replayid } = req.params;
  const { body } = req.body;
  const replay = await new CommentModel({
    body,
    createdBy: req.user._id,
  }).save();
  const comment = await CommentModel.findOneAndUpdate(
    { _id: replayid, isDeleted: false },
    { $push: { replies: replay } },
    { new: true }
  );
  comment ? res.json({ comment }) : res.json({ message: "wrong comment id" });
};

export const getCommentByID = async (req, res) => {
  const { id } = req.params;
  const comment = await CommentModel.findById(id).populate([
    {
      path: "createdBy",
    },
    {
      path: "postId",
      populate: [
        {
          path: "createdBy",
        },
        {
          path: "comments",
          match: { isDeleted: false },
          populate: {
            path: "replies",
            match: { isDeleted: false },
            populate: {
              path: "replies",
              match: { isDeleted: false },
            },
          },
        },
      ],
    },
    {
      path: "replies",
      match: { isDeleted: false },
      populate: {
        path: "replies",
        match: { isDeleted: false },
      },
    },
  ]);
  comment ? res.json({ comment }) : res.json({ message: "wrong comment id" });
};
