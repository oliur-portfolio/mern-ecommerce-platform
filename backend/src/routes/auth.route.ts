import { Router } from "express";
import {
  getMe,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getMe);
router.post("/refresh-access-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
