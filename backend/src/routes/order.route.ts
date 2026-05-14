import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";
import {
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.get("/my", isAuthenticated, getMyOrders);

router.get("/", isAuthenticated, isAdmin, getAllOrders);

router.patch("/:orderId", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
