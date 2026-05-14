import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useParams } from "react-router";
import { getProduct } from "../api/product.api";
import { useQuery } from "@tanstack/react-query";
import type { IProduct } from "../types/product.types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import RatingStars from "../components/Common/RatingStars";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ProductDetailsSkeleton from "../components/Skeletons/ProductDetailsSkeleton";
import ErrorUI from "../components/Common/ErrorUI";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const { user } = useAuth();
  const { addToCart, addingCartProductId } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId!),
    enabled: !!productId,
  });

  const productDetails = data?.product as IProduct;

  const isAddingToCart = addingCartProductId === productDetails?._id;

  const isWishlisted = isInWishlist(productDetails?._id);

  return (
    <section className="pt-10 pb-20">
      <div className="wrapper max-w-260">
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : isError ? (
          <ErrorUI message={error.message} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
            {/* Left: Images */}
            <div>
              {/* Main Slider */}
              <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
                <Swiper
                  modules={[Thumbs]}
                  thumbs={{ swiper: thumbsSwiper }}
                  className="rounded-2xl"
                >
                  {productDetails.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={image.url}
                        alt={productDetails.title}
                        className="w-full h-72 md:h-125 object-contain p-8"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnail Slider */}
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={12}
                slidesPerView={4}
                className="product-thumbs"
                breakpoints={{
                  640: {
                    slidesPerView: 5,
                  },
                }}
              >
                {productDetails.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <button type="button" className="p-2 w-full">
                      <img
                        src={image.url}
                        alt={productDetails.title}
                        loading="lazy"
                        className="w-full h-auto aspect-square object-contain"
                      />
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col">
              <div className="mb-3">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium capitalize">
                  {productDetails.category}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                {productDetails.title}
              </h1>

              <div className="mb-4">
                <RatingStars rating={productDetails.rating} />
              </div>

              <p className="text-3xl font-semibold text-gray-900 mb-5">
                ${productDetails.price}
              </p>

              <div className="mb-6 space-y-3">
                <p className="text-gray-600 leading-7">
                  {productDetails.description || "No description available."}
                </p>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-medium">
                  Stock:{" "}
                  <span className="text-gray-500">{productDetails.stock}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                {user?.role !== "admin" && (
                  <button
                    onClick={() => addToCart(productDetails)}
                    className="custom-btn flex-1"
                  >
                    {isAddingToCart ? (
                      <AiOutlineLoading3Quarters className="w-4.5 h-4.5 text-white animate-spin" />
                    ) : (
                      <FaShoppingCart className="w-4 h-4" />
                    )}
                    Add to Cart
                  </button>
                )}

                <button
                  onClick={() => toggleWishlist(productDetails)}
                  className={`w-11 h-11 rounded-lg border flex items-center justify-center transition bg-white shadow-sm ${
                    isWishlisted
                      ? "border-red-300 text-red-500"
                      : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300"
                  } ${user?.role === "admin" ? "hidden" : ""}`}
                >
                  <FaHeart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailsPage;
