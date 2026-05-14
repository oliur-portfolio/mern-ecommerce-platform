import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware";
import { getMyAddresses } from "../controllers/address.controller";

const router = Router();

router.get("/", isAuthenticated, getMyAddresses);

export default router;
