import axiosPrivate from "./axios";

export const getWishlist = async () => {
  const res = await axiosPrivate.get("/wishlist");
  return res.data;
};

export const toggleWishlistApi = async (productId: string) => {
  const res = await axiosPrivate.post("/wishlist/toggle", { productId });
  return res.data;
};

export const removeWishlistItemApi = async (productId: string) => {
  const res = await axiosPrivate.delete(`/wishlist/${productId}`);
  return res.data;
};

export const clearWishlistApi = async () => {
  const res = await axiosPrivate.delete("/wishlist");
  return res.data;
};

export const mergeWishlistApi = async (productIds: string[]) => {
  const res = await axiosPrivate.post("/wishlist/merge", { productIds });
  return res.data;
};
