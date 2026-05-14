const getOrderStatusClass = (status: string) => {
  switch (status) {
    case "delivered":
      return "bg-green-50 text-green-700 border-green-200";
    case "shipped":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "processing":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "cancelled":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getPaymentStatusClass = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-50 text-green-700 border-green-200";
    case "failed":
      return "bg-red-50 text-red-700 border-red-200";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const MyOrderCard = ({ order }: { order: any }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Order ID</p>
          <h2 className="text-base font-semibold text-gray-900 break-all">
            #{order._id}
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {new Date(order.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <span
          className={`px-3 py-1 rounded-full border text-sm font-medium capitalize ${getOrderStatusClass(
            order.orderStatus,
          )}`}
        >
          Order: {order.orderStatus}
        </span>

        <span
          className={`px-3 py-1 rounded-full border text-sm font-medium capitalize ${getPaymentStatusClass(
            order.paymentStatus,
          )}`}
        >
          Payment: {order.paymentStatus}
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item: any) => (
          <div
            key={item.product}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div>
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-gray-500">
                Qty: {item.quantity} × ${item.price}
              </p>
            </div>

            <p className="font-semibold text-gray-900">
              ${(item.quantity * item.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 mt-5 pt-4 flex items-center justify-between">
        <p className="text-gray-500">Total</p>
        <p className="text-lg font-semibold text-gray-900">
          ${order.total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MyOrderCard;
