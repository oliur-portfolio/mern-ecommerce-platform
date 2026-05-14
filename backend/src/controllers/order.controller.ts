import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import Order from "../models/order.model";

const allowedStatuses = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const filter = { user: req.user?._id };

  const [orders, totalOrders] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalOrders / limit);

  res.status(200).json({
    success: true,
    orders,
    page,
    totalPages,
    totalOrders,
    hasNextPage: page < totalPages,
  });
});

export const getAllOrders = asyncHandler(
  async (_req: Request, res: Response) => {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  },
);

export const updateOrderStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      throw new AppError(400, "Invalid order status");
    }

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError(404, "Order not found");
    }

    order.orderStatus = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  },
);
