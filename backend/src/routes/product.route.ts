import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";

const router = Router();

router.get("/", getProducts);
router.get("/:productId", getProduct);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:productId", isAuthenticated, isAdmin, updateProduct);
router.delete("/:productId", isAuthenticated, isAdmin, deleteProduct);

export default router;
