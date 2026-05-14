import { Link } from "react-router";

const CheckoutSuccessPage = () => {
  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-10 md:p-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Successful
          </h1>

          <p className="text-gray-500 mb-6">
            Thank you! Your order has been placed.
          </p>

          <Link to="/my-orders" className="custom-btn mx-auto">
            View My Orders
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccessPage;
