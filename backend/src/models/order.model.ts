import mongoose, { Document, Schema, Types } from "mongoose";

interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  stripeSessionId?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      country: String,
    },
    subtotal: Number,
    shipping: Number,
    total: Number,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    stripeSessionId: String,
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", orderSchema);

export default Order;
