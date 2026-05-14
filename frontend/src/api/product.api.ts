import type { TProductSchema } from "../pages/AdminProductsCreatePage";
import type {
  IGetProductsParams,
  IGetProductsResponse,
} from "../types/product.types";
import type { ICommonResponse } from "../types/user.types";
import axiosPrivate, { axiosPublic } from "./axios";

export const getProducts = async (
  params: IGetProductsParams = {},
): Promise<IGetProductsResponse> => {
  const response = await axiosPublic.get("/product", { params });

  return response.data;
};

export const getProduct = async (productId: string) => {
  const response = await axiosPublic.get(`/product/${productId}`);

  return response.data;
};

export const createProduct = async (
  data: TProductSchema,
): Promise<ICommonResponse> => {
  const res = await axiosPrivate.post("/product", data);
  return res.data;
};

export const updateProduct = async ({
  productId,
  data,
}: {
  productId: string;
  data: TProductSchema;
}) => {
  const res = await axiosPrivate.put(`/product/${productId}`, data);
  return res.data;
};

export const deleteProduct = async (id: string): Promise<ICommonResponse> => {
  const response = await axiosPrivate.delete(`/product/${id}`);

  return response.data;
};
