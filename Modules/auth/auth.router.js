import { Router } from "express";
import * as controller from "./controller/auth.js";
import { validate } from "../../Middlewares/validation.middleware.js";
import * as schemas from "./auth.validation.js";


const router = Router();


router.post("/signup", validate(schemas.signUp), controller.signUp);
router.get("/confirmation/:token",validate(schemas.tokenValidation),controller.confirmAccount);
router.post("/signin",validate(schemas.signIn),controller.signIn);



export default router;
