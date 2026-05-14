import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import errorHandler from "./middleware/error.middleware";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import addressRoutes from "./routes/address.route";
import productRoutes from "./routes/product.route";
import wishlistRoutes from "./routes/wishlist.route";
import cartRoutes from "./routes/cart.route";
import checkoutRoutes from "./routes/checkout.route";
import orderRoutes from "./routes/order.route";
import dashboardRoutes from "./routes/dashboard.route";
import stripeWebhookRoutes from "./routes/stripeWebhook.route";
import uploadRoutes from "./routes/upload.route";

connectDB();

const app = express();

app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookRoutes,
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MERN Ecommerce API is running",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    status: "healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/product", productRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
