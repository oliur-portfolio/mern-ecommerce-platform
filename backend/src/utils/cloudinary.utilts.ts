import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });
};

export const deleteSingleImage = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};

export const deleteMultipleImages = async (
  images: { publicId: string }[],
): Promise<void> => {
  if (!images || images.length === 0) return;
  await Promise.all(
    images.map((img) => cloudinary.uploader.destroy(img.publicId)),
  );
};

export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split("/");
  const fileWithExt = parts[parts.length - 1];
  const folder = parts[parts.length - 2];
  const publicId = fileWithExt.split(".")[0];
  return `${folder}/${publicId}`;
};
