import { Link } from "react-router";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/Common/ProductCard";
import type { IProduct } from "../types/product.types";
import WishlistSkeleton from "../components/Skeletons/WishlistSkeleton";
import ErrorUI from "../components/Common/ErrorUI";

const WishlistPage = () => {
  const {
    wishlistItems,
    wishlistCount,
    clearWishlist,
    isWishlistLoading,
    isWishlistError,
    wishlistError,
    removingWishlistProductId,
    togglingWishlistProductId,
    isClearingWishlist,
  } = useWishlist();

  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        {isWishlistLoading ? (
          <WishlistSkeleton />
        ) : isWishlistError ? (
          <ErrorUI message={wishlistError?.message} />
        ) : wishlistItems.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <FaHeart className="w-5 h-5 md:w-6 md:h-6 text-red-500" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h1>

            <p className="text-gray-500 mb-6">
              Save products you like and view them later.
            </p>

            <Link to="/products" className="custom-btn mx-auto">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Wishlist
                </h1>
                <p className="text-gray-500 mt-1">
                  You have {wishlistCount} saved products
                </p>
              </div>

              <button
                type="button"
                onClick={clearWishlist}
                disabled={isClearingWishlist}
                className="text-red-500 font-medium hover:text-red-600 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isClearingWishlist ? "Clearing..." : "Clear Wishlist"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {wishlistItems.map((product: IProduct) => {
                const isWishlistActionLoading =
                  removingWishlistProductId === product._id ||
                  togglingWishlistProductId === product._id;

                return (
                  <ProductCard
                    key={product._id}
                    product={product}
                    isWishListCard
                    isWishlistActionLoading={isWishlistActionLoading}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WishlistPage;
