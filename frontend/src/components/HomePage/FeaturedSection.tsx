import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getProducts } from "../../api/product.api";
import type { IProduct } from "../../types/product.types";
import ProductCard from "../Common/ProductCard";
import ProductCardSkeleton from "../Skeletons/ProductCardSkeleton";
import ErrorUI from "../Common/ErrorUI";
import EmptyState from "../Common/EmptyState";

const FeaturedSection = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      "products",
      { featured: true, limit: 4, page: 1, sort: "latest" },
    ],
    queryFn: () =>
      getProducts({
        featured: true,
        limit: 4,
        page: 1,
        sort: "latest",
      }),
  });

  const featuredProducts = data?.products || [];

  return (
    <section className="py-20 lg:py-30">
      <div className="wrapper">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Featured Products
            </h2>
            <p className="text-gray-500 mt-1">
              Hand-picked products for your collection
            </p>
          </div>

          <Link
            to="/products"
            className="text-blue-600 font-medium hover:underline shrink-0"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <ErrorUI message={error.message} />
        ) : featuredProducts.length === 0 ? (
          <EmptyState
            title="No featured products yet"
            message="New featured products will appear here soon."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {featuredProducts.map((product: IProduct) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
