import { Router } from "express";
import { testApi } from "../controllers/test.controller";

const router = Router();

router.get("/", testApi);

export default router;
