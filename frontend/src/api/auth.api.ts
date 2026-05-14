import type { TRegisterSchema } from "../pages/RegisterPage";
import type { ILoginPayload, ILoginResponse } from "../types/auth.types";
import type { ICommonResponse } from "../types/user.types";
import axiosPrivate, { axiosPublic } from "./axios";

export const registerUser = async (
  data: TRegisterSchema,
): Promise<ICommonResponse> => {
  const response = await axiosPublic.post("/auth/register", data);

  return response.data;
};

export const loginUser = async (
  credentials: ILoginPayload,
): Promise<ILoginResponse> => {
  const response = await axiosPublic.post("/auth/login", credentials);

  return response.data;
};

export const checkAuth = async () => {
  const response = await axiosPrivate.get("/auth/me");

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await axiosPrivate.post("/auth/refresh-access-token");

  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosPublic.post("/auth/logout");

  return response.data;
};
