import { Router } from "express";
import * as controller from "./controller/user.js";
import { auth } from "../../Middlewares/auth.middleware.js";
import { myMulter, HME, validationTypes } from "../../Services/Multer.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import { tokenAuth } from "../auth/auth.validation.js";
import * as schemas from "./user.validation.js";
const router = Router();

router.use(validate(tokenAuth));
router.use(auth());


router.get("/", controller.getAllUsers);

router.patch(
  "/profilepic",
  myMulter(validationTypes.image).single("image"),
  HME,
  controller.addProfilePic
);

router.put(
  "/coverpics",
  myMulter(validationTypes.image).array("images", 3),
  HME,
  controller.addCoverPics
);

router.put(
  "/profile",
  validate(schemas.updateProfile),
  controller.updateProfile
);

router.patch("/", controller.softDeleteProfile);

export default router;
