import { useInfiniteQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/order.api";
import EmptyState from "../components/Common/EmptyState";
import { useEffect, useRef } from "react";
import MyOrderCard from "../components/Common/MyOrderCard";
import MyOrderCardSkeleton from "../components/Skeletons/MyOrderCardSkeleton";
import ErrorUI from "../components/Common/ErrorUI";

const MyOrdersPage = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["my-orders"],
    queryFn: getMyOrders,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
  });

  const orders = data?.pages.flatMap((page) => page.orders) || [];

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;

        if (isVisible && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Orders</h1>
          <p className="text-gray-500 mt-1">
            Track your recent purchases and payment status
          </p>
        </div>

        <div className="space-y-5">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <MyOrderCardSkeleton key={index} />
            ))
          ) : isError ? (
            <ErrorUI message={(error as Error).message} />
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders found"
              message="You have not placed any orders yet."
            />
          ) : (
            <>
              {orders.map((order: any) => (
                <MyOrderCard key={order._id} order={order} />
              ))}

              {isFetchingNextPage &&
                Array.from({ length: 2 }).map((_, index) => (
                  <MyOrderCardSkeleton key={`loading-${index}`} />
                ))}
            </>
          )}
        </div>

        <div
          ref={loadMoreRef}
          className="h-14 flex items-center justify-center mt-6"
        >
          {isFetchingNextPage && (
            <p className="text-sm text-gray-500">Loading more orders...</p>
          )}

          {!hasNextPage && orders.length > 0 && (
            <p className="text-sm text-gray-400">You have reached the end.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyOrdersPage;
