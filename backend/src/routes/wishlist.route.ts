import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  clearWishlist,
  getCart1,
  getWishlist,
  mergeWishlist,
  removeWishlistItem,
  toggleWishlist,
} from "../controllers/wishlist.controller";

const router = Router();

router.get("/", isAuthenticated, getWishlist);
router.post("/toggle", isAuthenticated, toggleWishlist);
router.post("/merge", isAuthenticated, mergeWishlist);
router.delete("/:productId", isAuthenticated, removeWishlistItem);
router.delete("/", isAuthenticated, clearWishlist);

export default router;
