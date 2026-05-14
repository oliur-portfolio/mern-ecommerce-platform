import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import Cart from "../models/cart.model";
import Product from "../models/product.model";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  let cart = await Cart.findOne({ user: req.user?._id }).populate(
    "items.product",
  );

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });

    cart = await cart.populate("items.product");
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    throw new AppError(400, "Product id is required");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: product._id,
      quantity: Number(quantity),
    });
  }

  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
  );

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart: populatedCart,
  });
});

export const updateCartQuantity = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) < 1) {
      throw new AppError(400, "Quantity must be at least 1");
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new AppError(404, "Cart not found");
    }

    const item = cart.items.find(
      (cartItem) => cartItem.product.toString() === productId,
    );

    if (!item) {
      throw new AppError(404, "Product not found in cart");
    }

    item.quantity = Number(quantity);

    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product",
    );

    res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: populatedCart,
    });
  },
);

export const removeCartItem = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new AppError(404, "Cart not found");
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
 
    await cart.save();

    const populatedCart = await Cart.findOne({ user: userId }).populate(
      "items.product",
    );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  },
);

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    throw new AppError(404, "Cart not found");
  }

  cart.items = [];

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    cart,
  });
});

export const mergeCart = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const { items } = req.body as {
    items: {
      productId: string;
      quantity: number;
    }[];
  };

  if (!Array.isArray(items)) {
    throw new AppError(400, "Items must be an array");
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) continue;

    const existingItem = cart.items.find(
      (cartItem) => cartItem.product.toString() === item.productId,
    );

    if (existingItem) {
      existingItem.quantity += Number(item.quantity);
    } else {
      cart.items.push({
        product: product._id,
        quantity: Number(item.quantity),
      });
    }
  }

  await cart.save();

  const populatedCart = await Cart.findOne({ user: userId }).populate(
    "items.product",
  );

  res.status(200).json({
    success: true,
    message: "Cart synced successfully",
    cart: populatedCart,
  });
});
