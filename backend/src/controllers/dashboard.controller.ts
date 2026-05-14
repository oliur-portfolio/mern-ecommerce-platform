import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Order from "../models/order.model";
import Product from "../models/product.model";
import User from "../models/user.model";

export const getAdminDashboardStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    const paidOrders = await Order.find({ paymentStatus: "paid" });

    const totalRevenue = paidOrders.reduce(
      (total, order) => total + order.total,
      0,
    );

    const pendingOrders = await Order.countDocuments({
      orderStatus: "pending",
    });

    const processingOrders = await Order.countDocuments({
      orderStatus: "processing",
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "delivered",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        pendingOrders,
        processingOrders,
        deliveredOrders,
      },
    });
  },
);
