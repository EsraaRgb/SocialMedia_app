import UserModel from "../../../DB/Models/User.model.js";
import PostModel from '../../../DB/Models/Post.model.js'
import sendEmail from "../../../Services/sendEmail.js";
import jwt from "jsonwebtoken";
import cloudinary from "../../../Services/cloudinary.js";
import schedule from "node-schedule";
import paginate from "../../../Services/pagination.js";


export const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const { userName, email, gender, age } = req.body;
    let confirmEmail;
    if (email && email !== req.user.email) {
      const token = jwt.sign({ id: req.user._id }, process.env.SECRET, {
        expiresIn: 60 * 60,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/auth/confirmation/${token}`;
      const message = `  <div> To Confirm Your Changed Email, Please <a  href= ${link}>Click Here</a> </div>`;
      sendEmail(email, message);
      confirmEmail = false;
    }
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      {
        userName,
        email,
        gender,
        confirmEmail,
        age,
      },
      { new: true }
    );
    if (user) {
      res.status(202).json({ message: "Done", user });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "catch error", error });
  }
};
export const addProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "please upload an image" });
    } else {
      console.log("else");
      if (req.file.size < 100000) {
        const image = await cloudinary.uploader.upload(req.file.path, {
          folder: "user/profilePic",
        });
        await UserModel.updateOne(
          { _id: req.user._id },
          { profilePic: image.secure_url }
        );
        res.status(201).json({ message: "Done" });
      } else {
        res.status(500).json({ message: "Please Upload Smaller image" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const addCoverPics = async (req, res) => {
  try {
    if (!req.files) {
      res.status(400).json({ message: "please upload an image" });
    } else {
      if (req.files.length > 1) {
        req.files.forEach(async (file) => {
          const image = await cloudinary.uploader.upload(file.path, {
            folder: "user/coverpics",
          });
          await UserModel.updateOne(
            { _id: req.user._id },
            { $addToSet: { coverPics: image.secure_url } }
          );
        });
        res.status(201).json({ message: "Done" });
      } else {
        res.status(201).json({ message: "Please upload more than one image" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { skip, limit } = paginate(page, size);
    const users = UserModel.find({})
      .skip(skip)
      .limit(limit)
      .select("-password -createdAt -updatedAt -QRCode")
      .cursor();
    const allUsers = [];
    for (let user = await users.next(); user; user = await users.next()) {
      const posts = await PostModel.find({createdBy:user._id,isDeleted:false}).populate([
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
      ])
      const newUser = user.toObject() // because cursor is Bson not Json 
      newUser.posts = posts
      allUsers.push({user:newUser})
    }
    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};
export const softDeleteProfile = async (req, res) => {
  try {
    const result = await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { isDeleted: true },
      { new: true }
    );
    if (result) {
      res.status(202).json({ message: "Done", result });
    } else {
      res.status(404).json({ message: "wrong user id" });
    }
  } catch (error) {
    res.status(500).json({ message: "catch error", error });
  }
};

const cronJob = schedule.scheduleJob("30 13 * * *", async function () {
  const users = await UserModel.find({ age: { $gt: 20 } }).select(
    "email userName -_id"
  );
  users.forEach((user) => {
    const message = `  <div>Hello </div>`;
    const subject = `Daily message`;
    attachments = [
      {
        filename: "Lecture 2-SOA Case Studies.pdf",
        path: "./Lecture 2-SOA Case Studies.pdf",
      },
    ];
    sendEmail(user.email, subject, message, attachments);
  });
  console.log(users);
});

// const cronJob = schedule.scheduleJob({ hour: 13 , minute:30 }, async function () {});
