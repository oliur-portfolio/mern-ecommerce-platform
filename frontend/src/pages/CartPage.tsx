import { Link, useNavigate } from "react-router";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ErrorUI from "../components/Common/ErrorUI";
import CartSkeleton from "../components/Skeletons/CartSkeleton";

const CartPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const {
    isCartLoading,
    isCartError,
    cartError,
    cartItems,
    cartCount,
    subtotal,
    updatingCartProductId,
    removingCartProductId,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (user?.role === "admin") {
      toast.error("Admin accounts cannot place orders");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }

    navigate("/checkout");
  };

  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        {isCartLoading ? (
          <CartSkeleton />
        ) : isCartError ? (
          <ErrorUI message={cartError?.message} />
        ) : cartItems.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center w-full">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-6">
              Looks like you have not added anything yet.
            </p>
            <Link to="/products" className="custom-btn mx-auto">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex-1">
                {cartItems &&
                  cartItems.map((item) => {
                    const isUpdating =
                      updatingCartProductId === item.product._id;
                    const isRemoving =
                      removingCartProductId === item.product._id;
                    const isItemBusy = isUpdating || isRemoving;

                    return (
                      <div
                        key={item.product?._id}
                        className="p-5 border-b border-gray-200 last:border-b-0 flex gap-4"
                      >
                        <img
                          src={
                            item.product?.images?.[0]?.url ||
                            "/images/placeholder.jpg"
                          }
                          alt={item.product?.title}
                          loading="lazy"
                          className="w-16 h-16 md:w-24 md:h-24 p-1 rounded-lg md:rounded-xl object-cover border border-gray-200"
                        />

                        <div className="flex-1">
                          <Link to={`/products/${item.product?._id}`}>
                            <h2 className="text-lg md:text-xl font-medium text-gray-900 hover:text-blue-600 transition">
                              {item.product?.title}
                            </h2>
                          </Link>

                          <p className="text-sm text-gray-500 capitalize mt-1">
                            {item.product?.category}
                          </p>

                          <p className="text-lg font-semibold text-gray-900 mt-2">
                            ${item.product?.price}
                          </p>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(item.product._id)
                                }
                                disabled={isItemBusy}
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                              >
                                <FiMinus />
                              </button>

                              <span className="w-10 h-9 flex items-center justify-center border-x border-gray-300">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(item.product._id)
                                }
                                disabled={isItemBusy}
                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                              >
                                <FiPlus />
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product._id)}
                              disabled={isItemBusy}
                              className="text-red-500 hover:text-red-600 disabled:opacity-50"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 w-full max-w-87.5 ">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 border-b border-gray-200 pb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Items</span>
                    <span>{cartCount}</span>
                  </div>

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
                  type="button"
                  onClick={handleCheckout}
                  className="custom-btn w-full"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CartPage;
