import SkeletonBox from "./SkeletonBox";

const CartSkeleton = () => {
  return (
    <>
      <SkeletonBox className="w-60 h-5 mb-6" />

      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-5 border-b border-gray-200 last:border-b-0 flex gap-4"
            >
              <SkeletonBox className="w-16 h-16 md:w-24 md:h-24 rounded-lg md:rounded-xl border border-gray-200" />

              <div className="flex-1">
                <SkeletonBox className="w-full md:w-1/2 max-w-54 h-4 md:h-5" />

                <SkeletonBox className="w-20 h-4 md:h-5 mt-1" />

                <SkeletonBox className="w-20 h-4 md:h-5 mt-2" />

                <div className="flex items-center justify-between mt-4">
                  <SkeletonBox className="w-28.5 h-9 border border-gray-300 rounded-lg" />

                  <SkeletonBox className="w-5 h-4 md:h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 w-full max-w-87.5">
          <SkeletonBox className="w-40 h-5 mb-4" />

          <SkeletonBox className="w-60 h-5 mb-4" />

          <div className="space-y-3 border-b border-gray-200 pb-4">
            <div className="flex justify-between text-gray-600">
              <SkeletonBox className="w-20 h-5" />
              <SkeletonBox className="w-14 h-5" />
            </div>

            <div className="flex justify-between text-gray-600">
              <SkeletonBox className="w-20 h-5" />
              <SkeletonBox className="w-14 h-5" />
            </div>

            <div className="flex justify-between text-gray-600">
              <SkeletonBox className="w-20 h-5" />
              <SkeletonBox className="w-14 h-5" />
            </div>
          </div>

          <div className="flex justify-between text-lg font-semibold text-gray-900 py-4">
            <SkeletonBox className="w-20 h-5" />
            <SkeletonBox className="w-14 h-5" />
          </div>

          <SkeletonBox className="w-full h-12" />
        </div>
      </div>
    </>
  );
};

export default CartSkeleton;
