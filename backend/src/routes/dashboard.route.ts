import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middleware/auth.middleware";
import { getAdminDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", isAuthenticated, isAdmin, getAdminDashboardStats);

export default router;
