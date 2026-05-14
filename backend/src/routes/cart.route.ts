import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import {
  addToCart,
  clearCart,
  getCart,
  mergeCart,
  removeCartItem,
  updateCartQuantity,
} from "../controllers/cart.controller";

const router = Router();

router.get("/", isAuthenticated, getCart);
router.post("/", isAuthenticated, addToCart);
router.post("/merge", isAuthenticated, mergeCart);
router.patch("/:productId", isAuthenticated, updateCartQuantity);
router.delete("/:productId", isAuthenticated, removeCartItem);
router.delete("/", isAuthenticated, clearCart);

export default router;
