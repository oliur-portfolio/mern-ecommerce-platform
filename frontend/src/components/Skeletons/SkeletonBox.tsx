const SkeletonBox = ({ className }: { className?: string }) => {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />;
};

export default SkeletonBox;
