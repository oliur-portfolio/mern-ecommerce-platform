import SkeletonBox from "./SkeletonBox";

interface ProductCardSkeletonProps {
  isWishListCard?: boolean;
}

const ProductCardSkeleton = ({ isWishListCard }: ProductCardSkeletonProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="bg-gray-50 p-4">
        <SkeletonBox className="h-56 w-full" />
      </div>

      <div className="p-4">
        <SkeletonBox className="h-4 w-24 mb-3" />
        <SkeletonBox className="h-5 w-3/4 mb-3" />
        <SkeletonBox className="h-5 w-20 mb-4" />

        <div className="flex items-center gap-3">
          <SkeletonBox className="h-11 flex-1" />
          {isWishListCard && <SkeletonBox className="w-11 h-11" />}
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
