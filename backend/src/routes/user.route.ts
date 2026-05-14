import { Router } from "express";
import {
  deleteUser,
  editProfile,
  getUsers,
} from "../controllers/user.controller";
import {
  authorizeRoles,
  isAuthenticated,
  isBlocked,
} from "../middleware/auth.middleware";

const router = Router();

router.get("/", isAuthenticated, authorizeRoles("admin"), getUsers);

router.put("/edit-profile", isAuthenticated, isBlocked, editProfile);

router.delete(
  "/delete/:userId",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser,
);

export default router;
