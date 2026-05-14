import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import AppError from "../utils/AppError";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Address from "../models/address.model";
import stripe from "../config/stripe";
import Stripe from "stripe";

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user?._id) {
      throw new AppError(401, "Not authorized");
    }

    if (req.user.role === "admin") {
      throw new AppError(403, "Admin accounts cannot place orders");
    }

    const { items, shippingAddress, saveAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      throw new AppError(400, "Cart is empty");
    }

    if (
      !shippingAddress?.fullName ||
      !shippingAddress?.phone ||
      !shippingAddress?.address ||
      !shippingAddress?.city ||
      !shippingAddress?.country
    ) {
      throw new AppError(400, "Shipping address is required");
    }

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new AppError(404, "Product not found");
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new AppError(400, "Invalid quantity");
      }

      if (product.stock < quantity) {
        throw new AppError(400, `${product.title} is out of stock`);
      }

      subtotal += product.price * quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0]?.url || "",
        price: product.price,
        quantity,
      });
    }

    if (saveAddress) {
      const existingAddress = await Address.findOne({
        user: req.user._id,
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
      });

      if (!existingAddress) {
        await Address.create({
          user: req.user._id,
          ...shippingAddress,
        });
      }
    }

    const shipping = subtotal > 0 ? 10 : 0;
    const total = subtotal + shipping;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shipping,
      total,
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    const lineItems: any[] = orderItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout/cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    res.status(200).json({
      success: true,
      url: session.url,
    });
  },
);
