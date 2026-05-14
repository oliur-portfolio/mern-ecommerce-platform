import type { IGetOrdersResponse } from "../types/order.types";
import axiosPrivate from "./axios";

export const getMyOrders = async ({ pageParam = 1 }) => {
  const res = await axiosPrivate.get("/order/my", {
    params: {
      page: pageParam,
      limit: 5,
    },
  });

  return res.data;
};

export const getAllOrders = async (): Promise<IGetOrdersResponse> => {
  const res = await axiosPrivate.get("/order");
  return res.data;
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  const res = await axiosPrivate.patch(`/order/${orderId}`, { status });
  return res.data;
};
