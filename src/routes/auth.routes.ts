import { Router } from "express";
import {
  loginUser,
  signupUser,
  verifyEmail,
} from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, signupSchema } from "../validations/auth.validation";

const router = Router();

router.post("/signup", validate(signupSchema), signupUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/verify-email", verifyEmail);

export default router;
