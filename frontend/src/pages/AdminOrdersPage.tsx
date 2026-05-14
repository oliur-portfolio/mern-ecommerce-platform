import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getAllOrders, updateOrderStatus } from "../api/order.api";
import type { TOrderStatus } from "../types/order.types";
import { IoIosArrowDown } from "react-icons/io";
import ErrorUI from "../components/Common/ErrorUI";
import EmptyState from "../components/Common/EmptyState";

const orderStatuses: TOrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const getStatusClass = (status: string) => {
  if (status === "paid" || status === "delivered") {
    return "bg-green-50 text-green-600";
  }

  if (status === "processing" || status === "shipped") {
    return "bg-blue-50 text-blue-600";
  }

  if (status === "cancelled" || status === "failed") {
    return "bg-red-50 text-red-600";
  }

  return "bg-yellow-50 text-yellow-600";
};

const AdminOrdersPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrders,
  });

  const orders = data?.orders || [];

  const statusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      toast.success(data.message || "Order status updated");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to update order status");
    },
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
          <p className="text-gray-500 mt-1">
            Manage customer orders and delivery status
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="font-semibold">Loading orders...</p>
      ) : isError ? (
        <ErrorUI message={error?.message} />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders found"
          message="Orders from customers will appear here."
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-base min-w-250">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="text-left font-medium text-black px-5 py-3 rounded-tl-xl">
                  Order
                </th>
                <th className="text-left font-medium text-black px-5 py-3">
                  Customer
                </th>
                <th className="text-left font-medium text-black px-5 py-3">
                  Items
                </th>
                <th className="text-left font-medium text-black px-5 py-3">
                  Total
                </th>
                <th className="text-left font-medium text-black px-5 py-3">
                  Payment
                </th>
                <th className="text-left font-medium text-black px-5 py-3">
                  Order Status
                </th>
                <th className="text-left font-medium text-black px-5 py-3 rounded-tr-xl">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order, index) => {
                const isLastRow = index === orders.length - 1;

                return (
                  <tr
                    key={order._id}
                    className="border-b last:border-b-0 border-gray-100 hover:bg-gray-50"
                  >
                    <td
                      className={`px-5 py-4 text-gray-900 ${
                        isLastRow ? "rounded-bl-xl" : ""
                      }`}
                    >
                      <p className="font-medium">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.country}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      <p className="font-medium text-gray-900">
                        {order.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm">{order.user?.email}</p>
                    </td>

                    <td className="px-5 py-4 text-gray-500">
                      <p>{order.items.length} item(s)</p>
                      <p className="text-sm line-clamp-1">
                        {order.items.map((item) => item.title).join(", ")}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-900 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusClass(
                          order.paymentStatus,
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative">
                        <select
                          value={order.orderStatus}
                          disabled={statusMutation.isPending}
                          onChange={(e) =>
                            statusMutation.mutate({
                              orderId: order._id,
                              status: e.target.value,
                            })
                          }
                          className={`h-10 px-4 min-w-42.5 border border-gray-300 rounded-md outline-none appearance-none capitalize ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        <IoIosArrowDown
                          className={`absolute top-1/2 -translate-y-1/2 right-3 text-lg ${getStatusClass(
                            order.orderStatus,
                          )}`}
                        />
                      </div>
                    </td>

                    <td
                      className={`px-5 py-4 text-gray-500 ${
                        isLastRow ? "rounded-br-xl" : ""
                      }`}
                    >
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminOrdersPage;
