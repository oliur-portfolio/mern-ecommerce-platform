import { Link } from "react-router";

const CheckoutCancelPage = () => {
  return (
    <section className="pt-10 pb-20">
      <div className="wrapper">
        <div className="bg-white border border-gray-200 rounded-2xl px-6 py-10 md:p-10 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-500 mb-6">
            Your payment was cancelled. You can try again from your cart.
          </p>

          <Link to="/cart" className="custom-btn mx-auto">
            Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutCancelPage;
