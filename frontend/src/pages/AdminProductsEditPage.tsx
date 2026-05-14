import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";
import { getProduct, updateProduct } from "../api/product.api";
import { FaShoppingBag } from "react-icons/fa";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import useImageUpload from "../hooks/useImageUpload";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect } from "react";

const imageSchema = z.object({
  url: z.string(),
  publicId: z.string(),
});

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  rating: z.coerce.number().min(0).max(5),
  isFeatured: z.boolean().optional(),
  images: z
    .array(imageSchema)
    .max(5, "You can upload maximum 5 images")
    .optional(),
});

export type TProductSchema = z.infer<typeof productSchema>;

const categories = ["clothing", "shoes", "accessories", "home", "electronics"];

const AdminProductsEditPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TProductSchema>({
    resolver: zodResolver(productSchema) as Resolver<TProductSchema>,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      stock: 0,
      rating: 0,
      isFeatured: false,
      images: [],
    },
  });

  const {
    data: singleProduct,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  });

  // Upload Multiple Images
  const {
    images,
    isUploading,
    handleImageUpload,
    handleRemoveImage,
    setInitialImages,
  } = useImageUpload({
    multiple: true,
    maxImages: 5,
    onChange: (uploadedImages) => {
      setValue("images", uploadedImages);
    },
  });

  useEffect(() => {
    if (!singleProduct?.product) return;

    const product = singleProduct.product;

    reset({
      title: product.title || "",
      description: product.description || "",
      price: product.price || 0,
      category: product.category || "",
      stock: product.stock || 0,
      rating: product.rating || 0,
      isFeatured: product.isFeatured || false,
      images: product.images || [],
    });

    setInitialImages(product.images || []);
  }, [singleProduct, reset]);

  // Product Update Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      toast.success(data.message || "Product updated successfully");

      navigate("/admin-products");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update product");
    },
  });

  const onSubmit = (data: TProductSchema) => {
    mutate({
      productId: productId!,
      data,
    });
  };

  if (isLoading) {
    return <p className="font-semibold">Loading...</p>;
  }

  if (isError) {
    return <p className="font-semibold">{error.message}</p>;
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <FaShoppingBag className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 text-sm">Edit product to your store</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1.5">
            Product Title
          </label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Enter product title"
                className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={4}
                placeholder="Enter product description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none block"
              />
            )}
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
              Price
            </label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Enter price"
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              )}
            />
            {errors.price && (
              <p className="text-red-500">{errors.price.message}</p>
            )}
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <div className="relative">
                  <select
                    {...field}
                    className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
                  >
                    <option value="" defaultValue="" hidden>
                      Select category
                    </option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <IoIosArrowDown className="absolute top-1/2 -translate-y-1/2 right-3" />
                </div>
              )}
            />
            {errors.category && (
              <p className="text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* Stock & Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
              Stock
            </label>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-700 mb-1.5">
              Rating
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <input
                id="isFeatured"
                type="checkbox"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className="w-4 h-4"
              />
            )}
          />

          <label
            htmlFor="isFeatured"
            className="text-base font-medium text-gray-700"
          >
            Mark as Featured Product
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-1.5">
            Product Images
          </label>

          <label
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg transition ${
              images.length >= 5
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer hover:border-blue-400 hover:bg-blue-50"
            }`}
          >
            <FiUploadCloud className="w-7 h-7 text-gray-400 mb-1.5" />
            <p className="text-sm text-gray-500">Click to upload images</p>
            <p className="text-xs text-gray-400 mt-0.5">
              PNG, JPG, WEBP up to 10MB
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              disabled={images.length >= 5}
              onChange={(e) => {
                handleImageUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {errors.images && (
            <p className="text-red-500 mt-1">{errors.images.message}</p>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:flex lg:items-start gap-3 lg:flex-wrap mt-4">
              {images.map((item) => (
                <div
                  key={item.id}
                  className="relative group lg:w-40 lg:h-auto aspect-square lg:shrink-0 bg-white"
                >
                  <img
                    src={item.preview}
                    alt="preview"
                    className="w-full h-full object-cover rounded-md border border-gray-200 transition p-2"
                  />

                  {item.isUploading && (
                    <div className="absolute inset-0 bg-black/60 rounded-md animate-pulse" />
                  )}

                  {item.isUploading && (
                    <p className="text-sm font-semibold text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-wider">
                      Uploading...
                    </p>
                  )}

                  {!item.isUploading && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(item.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiX className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="custom-btn ml-auto"
        >
          {isPending ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProductsEditPage;
