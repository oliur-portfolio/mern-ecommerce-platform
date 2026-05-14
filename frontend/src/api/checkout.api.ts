import axiosPrivate from "./axios";

export interface ICheckoutPayload {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  saveAddress: boolean;
}

export const createCheckoutSession = async (data: ICheckoutPayload) => {
  const res = await axiosPrivate.post("/checkout/create-session", data);
  return res.data;
};
