import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../api/auth.api";
import toast from "react-hot-toast";
import { setAuthToken } from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type TLoginSchema = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { refetchUser } = useAuth();

  const [toggleEye, setToggleEye] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login Mutation
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      setAuthToken(data.accessToken);

      await refetchUser();

      toast.success(data.message);
      reset();
      navigate(from, { replace: true });
    },
  });

  const onSubmit = (data: TLoginSchema) => {
    mutate(data);
  };

  return (
    <div className="min-h-[calc(100vh-68px)] md:min-h-[calc(100vh-77px)] flex items-center justify-center bg-gray-50 py-20">
      <div className="wrapper">
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 w-full max-w-105 shadow-sm mx-auto">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-5">
            <FaShoppingBag className="w-5 h-5 text-blue-600" />
          </div>

          <h1 className="font-semibold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-base text-gray-500 mb-6">
            Sign in to your TaskFlow account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* EMAIL */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    placeholder="you@company.com"
                    className="w-full h-11 px-3 border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  />
                )}
              />

              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-1.5">
                Password
              </label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <input
                      {...field}
                      type={toggleEye ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full h-11 px-3 pr-9 border border-gray-300 rounded-md text-base text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                    <button
                      onClick={() => setToggleEye((prev) => !prev)}
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {toggleEye ? (
                        <BsEye className="w-4 h-4" />
                      ) : (
                        <BsEyeSlash className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              />

              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              disabled={isPending}
              type="submit"
              className="custom-btn w-full"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-base text-red-600 mt-4">
              {error.message}
            </div>
          )}

          <p className="text-center text-base text-gray-500 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
