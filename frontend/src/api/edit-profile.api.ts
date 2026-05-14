import type { ICommonResponse } from "../types/user.types";
import axiosPrivate from "./axios";

export type TEditProfilePayload = {
  name?: string;
  avatarUrl?: string;
};

export const editProfile = async (
  data: TEditProfilePayload,
): Promise<ICommonResponse> => {
  const response = await axiosPrivate.put("/user/edit-profile", data);
  return response.data;
};
