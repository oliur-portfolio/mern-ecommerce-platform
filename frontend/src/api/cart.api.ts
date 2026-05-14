import axiosPrivate from "./axios";

export interface ICartPayloadItem {
  productId: string;
  quantity: number;
}

export const getCart = async () => {
  const res = await axiosPrivate.get("/cart");
  return res.data;
};

export const addCartItem = async (data: ICartPayloadItem) => {
  const res = await axiosPrivate.post("/cart", data);
  return res.data;
};

export const updateCartItemQuantity = async ({
  productId,
  quantity,
}: ICartPayloadItem) => {
  const res = await axiosPrivate.patch(`/cart/${productId}`, { quantity });
  return res.data;
};

export const removeCartItem = async (productId: string) => {
  const res = await axiosPrivate.delete(`/cart/${productId}`);
  return res.data;
};

export const clearCartApi = async () => {
  const res = await axiosPrivate.delete("/cart");
  return res.data;
};

export const mergeCart = async (items: ICartPayloadItem[]) => {
  const res = await axiosPrivate.post("/cart/merge", { items });
  return res.data;
};
