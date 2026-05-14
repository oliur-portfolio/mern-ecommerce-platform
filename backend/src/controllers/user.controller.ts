import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import User from "../models/user.model";
import {
  deleteSingleImage,
  getPublicIdFromUrl,
} from "../utils/cloudinary.utilts";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find();

  if (!users) {
    throw new AppError(400, "Email already registered");
  }

  res.status(201).json({
    success: true,
    users,
  });
});

export const editProfile = asyncHandler(async (req: Request, res: Response) => {
  const { name, avatarUrl } = req.body;

  const currentUser = await User.findById(req.user?._id);

  if (!currentUser) {
    throw new AppError(404, "You are not authenticated!");
  }

  if (name) {
    currentUser.name = name;
  }

  if (avatarUrl) {
    if (currentUser.avatar?.publicId) {
      await deleteSingleImage(currentUser.avatar.publicId);
    }

    currentUser.avatar = {
      url: avatarUrl,
      publicId: getPublicIdFromUrl(avatarUrl),
    };
  }

  await currentUser.save();

  res.status(200).json({
    success: true,
    message: `${currentUser?.name} updated profile successfully`,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "No user found");
  }

  if (req.user?._id.toString() === userId) {
    throw new AppError(403, "Admin can't delete his own account.");
  }

  if (user.avatar?.publicId) {
    await deleteSingleImage(user.avatar.publicId);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `${user?.name} account is now deleted`,
  });
});
