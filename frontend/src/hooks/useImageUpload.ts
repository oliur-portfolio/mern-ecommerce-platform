import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteImage, uploadSingleImage } from "../api/upload.api";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface ImageItem {
  id: string;
  preview: string;
  uploaded: UploadedImage | null;
  isUploading: boolean;
}

interface UseImageUploadOptions {
  multiple?: boolean;
  maxImages?: number;
  onChange?: (images: UploadedImage[]) => void;
}

const useImageUpload = ({
  multiple = true,
  maxImages = 5,
  onChange,
}: UseImageUploadOptions = {}) => {
  const [images, setImages] = useState<ImageItem[]>([]);

  const isUploading = images.some((img) => img.isUploading);

  const uploadMutation = useMutation({
    mutationFn: uploadSingleImage,
  });

  const removeImageMutation = useMutation({
    mutationFn: deleteImage,
  });

  const syncImagesToParent = (updatedImages: ImageItem[]) => {
    const uploadedImages = updatedImages
      .filter((item) => item.uploaded)
      .map((item) => item.uploaded!) as UploadedImage[];

    onChange?.(uploadedImages);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return;

    let fileArray = Array.from(files);

    if (multiple && images.length + fileArray.length > maxImages) {
      toast.error(`You can upload maximum ${maxImages} images`);
      fileArray = fileArray.slice(0, maxImages - images.length);
    }

    if (fileArray.length === 0) return;

    if (!multiple) {
      images.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });

      setImages([]);
      fileArray = fileArray.slice(0, 1);
    }

    const newItems: ImageItem[] = fileArray.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      uploaded: null,
      isUploading: true,
    }));

    setImages((prev) => [...prev, ...newItems]);

    fileArray.forEach(async (file, index) => {
      const itemId = newItems[index].id;

      try {
        const formData = new FormData();
        formData.append("image", file);

        const data = await uploadMutation.mutateAsync(formData);

        setImages((prev) => {
          const updated = prev.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  uploaded: data.image,
                  isUploading: false,
                }
              : item,
          );

          syncImagesToParent(updated);
          return updated;
        });
      } catch (error: any) {
        setImages((prev) => {
          const failedItem = prev.find((item) => item.id === itemId);

          if (failedItem?.preview.startsWith("blob:")) {
            URL.revokeObjectURL(failedItem.preview);
          }

          const updated = prev.filter((item) => item.id !== itemId);
          syncImagesToParent(updated);
          return updated;
        });

        toast.error(error?.message || "Upload failed");
      }
    });
  };

  const handleRemoveImage = async (id: string) => {
    const targetImage = images.find((item) => item.id === id);

    if (!targetImage) return;

    try {
      if (targetImage.uploaded?.publicId) {
        await removeImageMutation.mutateAsync(targetImage.uploaded.publicId);
      }

      if (targetImage.preview.startsWith("blob:")) {
        URL.revokeObjectURL(targetImage.preview);
      }

      setImages((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        syncImagesToParent(updated);
        return updated;
      });

      toast.success("Image removed");
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove image");
    }
  };

  const clearImages = () => {
    images.forEach((item) => {
      if (item.preview.startsWith("blob:")) {
        URL.revokeObjectURL(item.preview);
      }
    });

    setImages([]);
    onChange?.([]);
  };

  const setInitialImages = (uploadedImages: UploadedImage[]) => {
    const initialItems = uploadedImages.map((image) => ({
      id: crypto.randomUUID(),
      preview: image.url,
      uploaded: image,
      isUploading: false,
    }));

    setImages(initialItems);
  };

  useEffect(() => {
    return () => {
      images.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, [images]);

  return {
    images,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    clearImages,
    setInitialImages,
  };
};

export default useImageUpload;
