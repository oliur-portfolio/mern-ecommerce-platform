import { useQuery } from "@tanstack/react-query";
import { FaBox, FaClipboardList, FaDollarSign, FaUsers } from "react-icons/fa";
import { MdPendingActions, MdLocalShipping } from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";
import { getAdminDashboardStats } from "../api/dashboard.api";
import EmptyState from "../components/Common/EmptyState";
import ErrorUI from "../components/Common/ErrorUI";
import StatCardSkeleton from "../components/Skeletons/StatCardSkeleton";

interface IDashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  deliveredOrders: number;
}

interface IDashboardStatsResponse {
  success: boolean;
  stats: IDashboardStats;
}

const AdminDashboardPage = () => {
  const { data, isLoading, isError, error } = useQuery<IDashboardStatsResponse>(
    {
      queryKey: ["admin-dashboard-stats"],
      queryFn: getAdminDashboardStats,
    },
  );

  const stats = data?.stats;

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: <FaDollarSign className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FaClipboardList className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <FaBox className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Customers",
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: <MdPendingActions className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Processing Orders",
      value: stats?.processingOrders || 0,
      icon: <MdLocalShipping className="w-5 h-5 text-blue-600" />,
    },
    {
      title: "Delivered Orders",
      value: stats?.deliveredOrders || 0,
      icon: <BsCheckCircleFill className="w-5 h-5 text-blue-600" />,
    },
  ];

  return (
    <section>
      <div className="mb-8">
        <h1 className="">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 7 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <ErrorUI message={error.message} />
      ) : statCards.length === 0 ? (
        <EmptyState
          title="No featured products yet"
          message="New featured products will appear here soon."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-1">{card.title}</p>

              <h2 className="text-2xl font-semibold text-gray-900">
                {card.value}
              </h2>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboardPage;
