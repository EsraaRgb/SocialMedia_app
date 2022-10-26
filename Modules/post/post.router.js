import { Router } from "express";
import * as controller from './controller/post.js'
import {validate} from '../../Middlewares/validation.middleware.js'
import {auth} from '../../Middlewares/auth.middleware.js' 
import * as schemas from './post.validation.js'
import { tokenAuth } from "../auth/auth.validation.js";
import { myMulter, HME, validationTypes } from "../../Services/Multer.js";

const router = Router();
router.use(validate(tokenAuth))
router.use(auth());

router.post('/',myMulter(validationTypes.image).single('picture'),HME,validate(schemas.addpost),controller.addPost)
router.put('/:id',myMulter(validationTypes.image).single('picture'),HME,validate(schemas.updatepost),controller.updatePost)
router.patch('/:id',validate(schemas.postID),controller.softDeletePost)
router.patch('/like/:id',validate(schemas.postID),controller.likePost)
router.patch('/unlike/:id',validate(schemas.postID),controller.unlikePost)
router.get('/',controller.getAllPosts)
router.get('/:id',validate(schemas.postID),controller.getUserPosts)

export default router;
