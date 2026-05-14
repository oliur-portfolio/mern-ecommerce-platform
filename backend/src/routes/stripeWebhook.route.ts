import { Router } from "express";
import { stripeWebhook } from "../controllers/stripeWebhook.controller";

const router = Router();

router.post("/", stripeWebhook);

export default router;
