import { Range } from "react-range";
import { useQuery } from "@tanstack/react-query";
import { IoIosArrowDown } from "react-icons/io";
import { useSearchParams } from "react-router";
import { getProducts } from "../api/product.api";
import ProductCard from "../components/Common/ProductCard";
import type { IProduct } from "../types/product.types";
import { useEffect, useState } from "react";
import ProductCardSkeleton from "../components/Skeletons/ProductCardSkeleton";
import ErrorUI from "../components/Common/ErrorUI";
import EmptyState from "../components/Common/EmptyState";
import Pagination from "../components/Common/Pagination";

const categories = ["clothing", "shoes", "accessories", "home", "electronics"];
const PRODUCTS_PER_PAGE = 6;

type SortOption =
  | "latest"
  | "oldest"
  | "price_asc"
  | "price_desc"
  | "rating_desc";

const sortOptions: SortOption[] = [
  "latest",
  "oldest",
  "price_asc",
  "price_desc",
  "rating_desc",
];

const getSortValue = (value: string | null): SortOption => {
  if (sortOptions.includes(value as SortOption)) {
    return value as SortOption;
  }

  return "latest";
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchText, setSearchText] = useState(
    searchParams.get("search") || "",
  );

  const page = Number(searchParams.get("page") || 1);
  const sort = getSortValue(searchParams.get("sort"));
  const category = searchParams.get("category") || "";
  const featured = searchParams.get("featured") === "true";
  const rating = searchParams.get("rating") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const selectedCategories = category ? category.split(",") : [];

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  const toggleCategory = (selectedCategory: string) => {
    const updated = selectedCategories.includes(selectedCategory)
      ? selectedCategories.filter((item) => item !== selectedCategory)
      : [...selectedCategories, selectedCategory];

    updateParam("category", updated.length ? updated.join(",") : undefined);
  };

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(newPage));
    setSearchParams(params);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParam("search", searchText || undefined);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const queryParams = {
    page,
    limit: PRODUCTS_PER_PAGE,
    category: category || undefined,
    featured: featured ? true : undefined,
    rating: rating ? Number(rating) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort,
    search: searchParams.get("search") || undefined,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => getProducts(queryParams),
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <section className="pt-10 pb-20 md:pb-30">
      <div className="wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <aside className="bg-white border border-gray-200 rounded-2xl p-5 h-fit">
            <div className="pb-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <p className="text-sm text-gray-500 mt-1">
                Narrow down your product search
              </p>

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full max-w-sm ml-auto h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none mt-5"
              />
            </div>

            <div className="py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Category
              </h3>

              <div className="space-y-3">
                {categories.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(item)}
                      onChange={() => toggleCategory(item)}
                      className="w-4 h-4"
                    />
                    <span className="text-gray-700 capitalize">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Price Range
              </h3>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    ${minPrice || 0}
                  </span>

                  <span className="text-sm font-medium text-gray-700">
                    ${maxPrice || 500}
                  </span>
                </div>

                <Range
                  step={5}
                  min={0}
                  max={500}
                  values={[
                    minPrice ? Number(minPrice) : 0,
                    maxPrice ? Number(maxPrice) : 500,
                  ]}
                  onChange={(values) => {
                    const params = new URLSearchParams(searchParams);

                    params.set("minPrice", String(values[0]));
                    params.set("maxPrice", String(values[1]));
                    params.set("page", "1");

                    setSearchParams(params);
                  }}
                  renderTrack={({ props, children }) => (
                    <div
                      {...props}
                      className="w-full h-1.5 bg-gray-200 rounded-full relative"
                    >
                      <div
                        className="absolute h-full bg-blue-600 rounded-full"
                        style={{
                          left: `${((minPrice ? Number(minPrice) : 0) / 500) * 100}%`,
                          width: `${
                            (((maxPrice ? Number(maxPrice) : 500) -
                              (minPrice ? Number(minPrice) : 0)) /
                              500) *
                            100
                          }%`,
                        }}
                      />

                      {children}
                    </div>
                  )}
                  renderThumb={({ props }) => {
                    const { key, ...restProps } = props;

                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="w-5 h-5 rounded-full bg-blue-600 ring-4 ring-blue-100 cursor-pointer outline-none"
                      />
                    );
                  }}
                />

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>$0</span>
                  <span>$500</span>
                </div>
              </div>
            </div>

            <div className="py-5 border-b border-gray-200">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Product Type
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    updateParam(
                      "featured",
                      e.target.checked ? "true" : undefined,
                    )
                  }
                  className="w-4 h-4"
                />
                <span className="text-gray-700">Popular Products</span>
              </label>
            </div>

            <div className="pt-5">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Rating
              </h3>

              <div className="relative">
                <select
                  value={rating}
                  onChange={(e) =>
                    updateParam("rating", e.target.value || undefined)
                  }
                  className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                >
                  <option value="">Any rating</option>
                  <option value="4">4 stars & up</option>
                  <option value="3">3 stars & up</option>
                  <option value="2">2 stars & up</option>
                  <option value="1">1 star & up</option>
                </select>

                <IoIosArrowDown className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600" />
              </div>
            </div>
          </aside>

          <div>
            <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Products
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing {products.length} of {totalProducts} products
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sort by:
                  </span>

                  <div className="relative min-w-52 flex-1 md:flex-none">
                    <select
                      value={sort}
                      onChange={(e) => updateParam("sort", e.target.value)}
                      className="w-full h-11 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none appearance-none bg-white"
                    >
                      <option value="latest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating_desc">Top Rated</option>
                    </select>

                    <IoIosArrowDown className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : isError ? (
              <ErrorUI message={error.message} />
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                message="Try changing your filters or search query."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product: IProduct) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={changePage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
