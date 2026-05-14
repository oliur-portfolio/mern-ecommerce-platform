import type { ICommonResponse } from "../types/user.types";
import axiosPrivate from "./axios";

export const getUsers = async () => {
  const response = await axiosPrivate.get("/user");

  return response.data;
};

export const deleteUser = async (id: string): Promise<ICommonResponse> => {
  const response = await axiosPrivate.delete(`/user/delete/${id}`);

  return response.data;
};
