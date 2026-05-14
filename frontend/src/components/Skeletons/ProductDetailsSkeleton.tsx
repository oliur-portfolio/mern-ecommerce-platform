import SkeletonBox from "./SkeletonBox";

const ProductDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
      <div>
        {/* Main Slider */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-4">
          <SkeletonBox className="w-full h-72 md:h-125" />
        </div>

        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBox
              key={index}
              className="w-full h-auto aspect-square rounded-xl"
            />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex flex-col">
        <SkeletonBox className="w-24 h-7 rounded-full mb-3" />

        <SkeletonBox className="w-full h-7 mb-3" />

        <SkeletonBox className="w-30 h-6 mb-4" />

        <SkeletonBox className="w-20 h-7 mb-5" />

        <div className="mb-6 space-y-1">
          <SkeletonBox className="w-full h-5" />
          <SkeletonBox className="w-full h-5" />
          <SkeletonBox className="w-full h-5" />
        </div>

        <SkeletonBox className="w-20 h-6 mb-6" />

        <div className="flex items-center gap-3">
          <SkeletonBox className="h-11 flex-1" />

          <SkeletonBox className="w-11 h-11 rounded-lg border border-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
