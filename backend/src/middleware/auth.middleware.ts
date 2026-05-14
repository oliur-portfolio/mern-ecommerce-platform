import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError(401, "Not authorized, no user found");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError(
        401,
        `Role '${req.user.role}' is not allowed to access this route`,
      );
    }

    next();
  };
};

export const isAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin") {
      throw new AppError(403, "Only admin can access this route");
    }

    next();
  },
);

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      throw new AppError(401, "Not authorized, no token");
    }

    const accessToken = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as { userId: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AppError(401, "User not found");
    }

    req.user = user;

    next();
  },
);

export const isBlocked = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.status === "blocked") {
      throw new AppError(
        403,
        "Your account is blocked. You cannot perform this action.",
      );
    }

    next();
  },
);
