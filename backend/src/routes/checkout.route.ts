import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { createCheckoutSession } from "../controllers/checkout.controller";

const router = Router();

router.post("/create-session", isAuthenticated, createCheckoutSession);

export default router;
