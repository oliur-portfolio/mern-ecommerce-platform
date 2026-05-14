export type TOrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type TPaymentStatus = "pending" | "paid" | "failed";

export interface IOrderItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrderUser {
  _id: string;
  name: string;
  email: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface IOrder {
  _id: string;
  user: IOrderUser;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shipping: number;
  total: number;
  paymentStatus: TPaymentStatus;
  orderStatus: TOrderStatus;
  stripeSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetOrdersResponse {
  success: boolean;
  orders: IOrder[];
}
