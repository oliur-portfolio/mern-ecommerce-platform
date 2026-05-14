import { Request, Response } from "express";
import stripe from "../config/stripe";
import Order from "../models/order.model";
import Product from "../models/product.model";
import Cart from "../models/cart.model";

export const stripeWebhook = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).send("Missing stripe signature");
  }

  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error: any) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return res.status(400).send("Order id missing");
      }

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).send("Order not found");
      }

      if (order.paymentStatus === "paid") {
        return res.status(200).json({ received: true });
      }

      order.paymentStatus = "paid";
      order.orderStatus = "processing";
      order.stripeSessionId = session.id;

      await order.save();

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      await Cart.findOneAndUpdate(
        { user: order.user },
        {
          items: [],
        },
      );
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(500).send(`Webhook handler failed: ${error.message}`);
  }
};
