import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import {
  deleteUploadedImage,
  uploadSingleImage,
} from "../controllers/upload.controller";

const router = Router();

router.post(
  "/single",
  isAuthenticated,
  upload.single("image"),
  uploadSingleImage,
);

router.delete("/", isAuthenticated, deleteUploadedImage);

export default router;
