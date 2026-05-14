import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router";
import type { IProduct } from "../../types/product.types";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import RatingStars from "./RatingStars";
import { FiTrash2 } from "react-icons/fi";

interface ProductCardProps {
  product: IProduct;
  isWishListCard?: boolean;
}

const ProductCard = ({ product, isWishListCard }: ProductCardProps) => {
  const { user } = useAuth();
  const { addToCart, addingCartProductId } = useCart();
  const { toggleWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product._id);
  const isAddingToCart = addingCartProductId === product._id;

  return (
    <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition">
      <div className="relative">
        <Link to={`/products/${product._id}`} className="block bg-white">
          <img
            src={product.images[0].url}
            alt={product.title}
            loading="lazy"
            className="w-full h-64 object-contain p-4 group-hover:scale-105 transition duration-300"
          />
        </Link>

        <div className="absolute top-3 left-3">
          <h2 className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm capitalize font-medium">
            {product.category}
          </h2>
        </div>

        {!isWishListCard && user?.role !== "admin" && (
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full border flex items-center justify-center transition bg-white shadow-sm ${
              isWishlisted
                ? "border-red-300 text-red-500"
                : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-300"
            }`}
          >
            <FaHeart className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <RatingStars rating={product.rating} />
        </div>

        <Link
          to={`/products/${product._id}`}
          className="text-base text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-1"
        >
          {product.title}
        </Link>

        <p className="text-xl font-semibold text-gray-900 mb-3">
          ${product.price}
        </p>

        {user?.role !== "admin" && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => addToCart(product)}
              className="custom-btn flex-1"
            >
              {isAddingToCart ? (
                <AiOutlineLoading3Quarters className="w-4.5 h-4.5 text-white animate-spin" />
              ) : (
                <FaShoppingCart className="w-4 h-4" />
              )}
              Add to Cart
            </button>

            {isWishListCard && (
              <button
                type="button"
                onClick={() => removeFromWishlist(product._id)}
                className="w-11 h-11 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition"
              >
                <FiTrash2 className="w-4.5 h-4.5 text-red-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
