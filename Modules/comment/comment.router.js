import { Router } from "express";
import * as controller from "./controller/comment.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import * as schemas from "../post/post.validation.js";
import { tokenAuth } from "../auth/auth.validation.js";

const router = Router();

router.use(validate(tokenAuth));
router.use(auth());

router.post("/:id", validate(schemas.postID), controller.addComment);
router.put("/:id", validate(schemas.postID), controller.updateComment);
router.patch("/:id", validate(schemas.postID), controller.softDeleteComment);
router.patch("/like/:id", validate(schemas.postID), controller.likeComment);
router.post("/replay/:id",validate(schemas.postID), controller.CommentReplay);
router.post("/replay/:id/:replayid",validate(schemas.replay), controller.ReplayOnReplay);
router.get("/:id",validate(schemas.postID), controller.getCommentByID);

export default router;
