import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaRegUser } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useImageUpload, { type UploadedImage } from "../hooks/useImageUpload";
import { editProfile } from "../api/edit-profile.api";

const editProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  avatarUrl: z.string().optional(),
});

type TEditProfileSchema = z.infer<typeof editProfileSchema>;

const ProfileEditPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TEditProfileSchema>({
    resolver: zodResolver(editProfileSchema) as Resolver<TEditProfileSchema>,
    defaultValues: {
      name: user?.name || "",
      avatarUrl: user?.avatar?.url || "",
    },
  });

  const { images, isUploading, handleImageUpload } = useImageUpload({
    multiple: false,
    onChange: (uploadedImages: UploadedImage[]) => {
      setValue("avatarUrl", uploadedImages[0]?.url || "");
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: editProfile,
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update profile");
    },
  });

  const onSubmit = (data: TEditProfileSchema) => {
    mutate(data);
  };

  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <FaRegUser className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h1>
              <p className="text-gray-500 text-sm">
                Update your name and profile image
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <img
                  src={
                    images[0]?.preview ||
                    user?.avatar?.url ||
                    "/images/user.png"
                  }
                  alt="Profile"
                  className="w-22 md:w-28 h-auto aspect-square rounded-full object-cover border border-gray-200"
                />

                {/* Upload Overlay */}
                <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition">
                  <FiCamera className="w-6 h-6 text-white" />

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                </label>

                {/* Loading Overlay */}
                {images[0]?.isUploading && (
                  <div className="absolute inset-0 rounded-full bg-black/60 animate-pulse flex items-center justify-center" />
                )}
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Click image to change profile picture
              </p>
            </div>

            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Name
              </label>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter your name"
                    className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                )}
              />

              {errors.name && (
                <p className="text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending || isUploading}
              className="custom-btn ml-auto"
            >
              {isPending ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProfileEditPage;
