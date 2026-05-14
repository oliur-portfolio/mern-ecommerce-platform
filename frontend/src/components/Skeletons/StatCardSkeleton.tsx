import SkeletonBox from "./SkeletonBox";

const StatCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <SkeletonBox className="w-11 h-11 rounded-lg" />
      </div>

      <SkeletonBox className="w-40 h-4 mb-1" />

      <SkeletonBox className="w-20 h-7" />
    </div>
  );
};

export default StatCardSkeleton;
