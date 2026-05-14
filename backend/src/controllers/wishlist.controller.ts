import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import Wishlist from "../models/wishlist.model";
import Product from "../models/product.model";

export const getCart1 = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Cart working",
  });
});

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  let wishlist = await Wishlist.findOne({ user: userId }).populate("products");

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [],
    });

    wishlist = await wishlist.populate("products");
  }

  res.status(200).json({
    success: true,
    wishlist,
  });
});

export const toggleWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.body;

    if (!productId) {
      throw new AppError(400, "Product id is required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.some(
      (item) => item.toString() === productId,
    );

    if (alreadyExists) {
      wishlist.products = wishlist.products.filter(
        (item) => item.toString() !== productId,
      );
    } else {
      wishlist.products.push(product._id);
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: alreadyExists
        ? "Product removed from wishlist"
        : "Product added to wishlist",
      wishlist: populatedWishlist,
    });
  },
);

export const removeWishlistItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new AppError(404, "Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.toString() !== productId,
    );

    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: populatedWishlist,
    });
  },
);

export const clearWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new AppError(404, "Wishlist not found");
    }

    wishlist.products = [];

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      wishlist,
    });
  },
);

export const mergeWishlist = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productIds } = req.body as { productIds: string[] };

    if (!Array.isArray(productIds)) {
      throw new AppError(400, "productIds must be an array");
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        products: [],
      });
    }

    for (const productId of productIds) {
      const product = await Product.findById(productId);

      if (!product) continue;

      const alreadyExists = wishlist.products.some(
        (item) => item.toString() === productId,
      );

      if (!alreadyExists) {
        wishlist.products.push(product._id);
      }
    }

    await wishlist.save();

    const populatedWishlist = await Wishlist.findOne({
      user: userId,
    }).populate("products");

    res.status(200).json({
      success: true,
      message: "Wishlist synced successfully",
      wishlist: populatedWishlist,
    });
  },
);
