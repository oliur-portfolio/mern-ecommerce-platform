import { useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createCheckoutSession } from "../api/checkout.api";
import { getMyAddresses } from "../api/address.api";

interface ICheckoutForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  saveAddress: boolean;
  selectedAddressId: string;
}

const CheckoutPage = () => {
  const { cartItems, subtotal } = useCart();
  const { user } = useAuth();

  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const { data: addressData } = useQuery({
    queryKey: ["my-addresses"],
    queryFn: getMyAddresses,
  });

  const addresses = addressData?.addresses || [];

  const { control, handleSubmit, setValue, watch } = useForm<ICheckoutForm>({
    defaultValues: {
      fullName: user?.name || "",
      phone: "",
      address: "",
      city: "",
      country: "",
      saveAddress: false,
      selectedAddressId: "",
    },
  });

  const selectedAddressId = watch("selectedAddressId");

  useEffect(() => {
    if (!selectedAddressId) return;

    const selectedAddress = addresses.find(
      (item: any) => item._id === selectedAddressId,
    );

    if (!selectedAddress) return;

    setValue("fullName", selectedAddress.fullName);
    setValue("phone", selectedAddress.phone);
    setValue("address", selectedAddress.address);
    setValue("city", selectedAddress.city);
    setValue("country", selectedAddress.country);
    setValue("saveAddress", false);
  }, [selectedAddressId, addresses, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to start checkout");
    },
  });

  const onSubmit = (data: ICheckoutForm) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const items = cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    mutate({
      items,
      shippingAddress: {
        fullName: data.fullName,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
      },
      saveAddress: data.saveAddress,
    });
  };

  return (
    <section className="py-10">
      <div className="wrapper">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Checkout</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Shipping Information
            </h2>

            {addresses.length > 0 && (
              <div className="mb-5">
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Saved Addresses
                </label>

                <Controller
                  name="selectedAddressId"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                    >
                      <option value="">Use new address</option>

                      {addresses.map((address: any) => (
                        <option key={address._id} value={address._id}>
                          {address.address}, {address.city}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <Controller
                  name="fullName"
                  control={control}
                  rules={{ required: "Full name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: "Phone is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-base font-medium text-gray-700 mb-1.5">
                  Address
                </label>
                <Controller
                  name="address"
                  control={control}
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">
                    City
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    )}
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-1.5">
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: "Country is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    )}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Controller
                  name="saveAddress"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4"
                    />
                  )}
                />
                <span className="text-gray-700">
                  Save this address for future orders
                </span>
              </label>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4 border-b border-gray-200 pb-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <img
                    src={
                      item.product.images?.[0]?.url || "/images/placeholder.jpg"
                    }
                    alt={item.product.title}
                    className="w-14 h-14 p-1 rounded-lg object-cover border border-gray-200"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {item.product.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-b border-gray-200 py-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-semibold text-gray-900 py-4">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="custom-btn w-full justify-center"
            >
              {isPending ? "Redirecting..." : "Pay with Stripe"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutPage;
