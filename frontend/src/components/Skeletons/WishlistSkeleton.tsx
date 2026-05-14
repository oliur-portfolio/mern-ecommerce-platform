import ProductCardSkeleton from "./ProductCardSkeleton";
import SkeletonBox from "./SkeletonBox";

const WishlistSkeleton = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex-1">
          <SkeletonBox className="w-1/2 md:w-40 h-6 md:h-8" />

          <SkeletonBox className="w-full md:w-1/2 h-6 mt-1" />
        </div>

        <SkeletonBox className="w-30 h-6 mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} isWishListCard />
        ))}
      </div>
    </>
  );
};

export default WishlistSkeleton;
