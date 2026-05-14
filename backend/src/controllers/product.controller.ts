import { Request, Response } from "express";
import AppError from "../utils/AppError";
import Product from "../models/product.model";
import asyncHandler from "../utils/asyncHandler";
import { deleteMultipleImages } from "../utils/cloudinary.utilts";

export const createProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      price,
      category,
      description,
      images,
      stock,
      rating,
      isFeatured,
    } = req.body;

    if (!title || !price || !category) {
      throw new AppError(400, "Title, price and category are required");
    }

    if (images && images.length > 5) {
      throw new AppError(400, "You can upload maximum 5 images");
    }

    await Product.create({
      title,
      price,
      category,
      description,
      images,
      stock,
      rating,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  },
);

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const {
    page = "1",
    limit = "6",
    category,
    featured,
    minPrice,
    maxPrice,
    rating,
    sort = "latest",
    search,
  } = req.query;

  const currentPage = Number(page) || 1;
  const perPage = Number(limit) || 6;
  const skip = (currentPage - 1) * perPage;

  const filter: any = {};

  // Category filter
  if (category) {
    const categories = String(category)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (categories.length > 0) {
      filter.category = { $in: categories };
    }
  }

  // Featured filter
  if (featured === "true") {
    filter.isFeatured = true;
  }

  if (featured === "false") {
    filter.isFeatured = false;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};

    if (minPrice) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Rating filter
  if (rating) {
    filter.rating = { $gte: Number(rating) };
  }

  if (search) {
    filter.title = { $regex: String(search), $options: "i" };
  }

  // Sorting
  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };

  if (sort === "price_asc") {
    sortOption = { price: 1 };
  }

  if (sort === "price_desc") {
    sortOption = { price: -1 };
  }

  if (sort === "rating_desc") {
    sortOption = { rating: -1 };
  }

  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(perPage);

  res.status(200).json({
    success: true,
    message: `${products.length > 0 ? products.length : "No"} products found`,
    totalProducts,
    currentPage,
    totalPages: Math.ceil(totalProducts / perPage),
    products,
  });
});

export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(404, "Product not found");
  }

  res.status(200).json({
    success: true,
    message: "Product found",
    product,
  });
});

export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const {
      title,
      price,
      category,
      description,
      images,
      stock,
      rating,
      isFeatured,
    } = req.body;

    if (!title || !price || !category) {
      throw new AppError(400, "Title, price and category are required");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    product.title = title;
    product.price = price;
    product.category = category;
    product.description = description || "";
    product.images = images || [];
    product.stock = stock ?? 0;
    product.rating = rating ?? 0;
    product.isFeatured = isFeatured ?? false;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
    });
  },
);

export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    if (product.images.length > 0) {
      await deleteMultipleImages(product.images);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);
