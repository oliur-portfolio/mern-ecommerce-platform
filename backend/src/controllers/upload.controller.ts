import { Request, Response } from "express";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";
import {
  deleteSingleImage,
  uploadToCloudinary,
} from "../utils/cloudinary.utilts";

export const uploadSingleImage = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(400, "No image provided");
    }

    const uploaded = await uploadToCloudinary(req.file.buffer, "uploads");

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      },
    });
  },
);

export const deleteUploadedImage = asyncHandler(async (req, res) => {
  console.log(req.query.publicId);
  const publicId = req.query.publicId as string;

  if (!publicId) {
    throw new AppError(400, "publicId is required");
  }

  await deleteSingleImage(publicId);

  res.json({
    success: true,
    message: "Image deleted successfully",
  });
});
