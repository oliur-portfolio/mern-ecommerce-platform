import SkeletonBox from "./SkeletonBox";

const MyOrderCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <SkeletonBox className="w-24 h-4 mb-1" />
          <SkeletonBox className="w-60 h-4" />
        </div>

        <SkeletonBox className="w-24 h-4" />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <SkeletonBox className="w-40 h-7.5 rounded-full border border-gray-200" />

        <SkeletonBox className="w-40 h-7.5 rounded-full border border-gray-200" />
      </div>

      <div className="mt-5 space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="space-y-1 flex-1">
              <SkeletonBox className="w-full md:w-60 h-4" />
              <SkeletonBox className="w-full md:w-25 h-4" />
            </div>

            <SkeletonBox className="w-24 h-4" />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-5 pt-4 flex items-center justify-between">
        <SkeletonBox className="w-24 h-4" />
        <SkeletonBox className="w-24 h-4" />
      </div>
    </div>
  );
};

export default MyOrderCardSkeleton;
