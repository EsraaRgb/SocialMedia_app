import PostModel from "../../../DB/Models/Post.model.js";
import cloudinary from "../../../Services/Cloudinary.js";
import paginate from "../../../Services/pagination.js";
export const addPost = async (req, res) => {
  try {
    const { body } = req.body;
    const createdBy = req.user._id;
    const picture = await cloudinary.uploader.upload(req.file.path, {
      folder: "post",
    });
    const newPost = await new PostModel({
      body,
      createdBy,
      picture: picture.secure_url,
    }).save();
    res.json({ message: "Done", newPost });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    let picture;
    if (req.file) {
      picture = await cloudinary.uploader.upload(req.file.path, {
        folder: "post",
      });
    }
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { body, picture: picture.secure_url },
      { new: true }
    );
    updatedPost
      ? res.json({ message: "Done", updatedPost })
      : res.json({ message: "Wrong Id" });
  } catch (error) {
    res.json({ message: "catch error", error });
  }
};
export const softDeletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PostModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(404).json({ message: "wrong post id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PostModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: { $ne: req.user._id },
        likes: { $nin: req.user._id },
      },
      {
        $addToSet: { likes: req.user._id },
        $pull: { unlikes: req.user._id },
      },
      { new: true }
    );
    if (result) {
      res.status(201).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to like the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await PostModel.findOneAndUpdate(
      {
        _id: id,
        createdBy: { $ne: req.user._id },
        likes: { $in: req.user._id },
      },
      {
        $pull: { likes: req.user._id },
        $addToSet: { unlikes: req.user._id },
      },
      { new: true }
    );
    if (result) {
      res.status(202).json(result);
    } else {
      res.status(400).json({
        message: "Wrong Id or you are not allowed to unlike the product",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { skip, limit } = paginate(page, size);
    const posts = await PostModel.find({})
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: "createdBy",
          match: { isDeleted: false },
          select: "userName age email gender",
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
      ]);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
export const getUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page, size } = req.query;
    const { skip, limit } = paginate(page, size);
    const posts = await PostModel.find({ createdBy: id })
      .skip(skip)
      .limit(limit)
      .populate([
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
      ]);
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
