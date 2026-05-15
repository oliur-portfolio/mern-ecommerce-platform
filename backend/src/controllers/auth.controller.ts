import { CookieOptions, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import User from "../models/user.model";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

const isProduction = process.env.NODE_ENV === "production";

const cookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookieBaseOptions,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const clearCookieOptions: CookieOptions = {
  ...cookieBaseOptions,
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, "Please provide all fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(400, "Email already registered");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: `${user.name} account created successfully`,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(400, "Please provide all fields");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new AppError(400, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshToken = refreshToken;

  await user.save();

  res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

  res.status(200).json({
    success: true,
    message: `${user.name} logged in successfully`,
    accessToken,
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError(401, "Not authorized");
  }

  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
      throw new AppError(401, "No refresh token");
    }

    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as { userId: string };

    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      throw new AppError(401, "Invalid refresh token");
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      success: true,
      message: "Refresh access token successfully",
      accessToken: newAccessToken,
    });
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN_SECRET as string,
      ) as { userId: string };

      await User.findByIdAndUpdate(decoded.userId, {
        refreshToken: "",
      });
    } catch {
      console.log("Something went wrong!");
    }
  }

  res.clearCookie("refreshToken", clearCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
