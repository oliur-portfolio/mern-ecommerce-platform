import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Address from "../models/address.model";

export const getMyAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const addresses = await Address.find({ user: userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  },
);
