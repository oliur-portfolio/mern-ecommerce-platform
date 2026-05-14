import type { IImage } from "./product.types";

export interface IImageUploadResponse {
  success: boolean;
  message: string;
  image: IImage;
}
