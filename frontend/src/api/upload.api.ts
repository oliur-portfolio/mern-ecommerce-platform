import type { IImageUploadResponse } from "../types/upload.types";
import type { ICommonResponse } from "../types/user.types";
import axiosPrivate from "./axios";

export const uploadSingleImage = async (
  formData: FormData,
): Promise<IImageUploadResponse> => {
  const res = await axiosPrivate.post("/upload/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteImage = async (
  publicId: string,
): Promise<ICommonResponse> => {
  const response = await axiosPrivate.delete("/upload", {
    params: { publicId },
  });
  return response.data;
};
