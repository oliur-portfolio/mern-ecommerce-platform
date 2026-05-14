import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";

export const testApi = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "test successfully",
  });
});
