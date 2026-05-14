import { Link } from "react-router";

const NotFoundPage = () => {
  return (
    <section className="min-h-[calc(100vh-77px)] flex items-center justify-center py-10">
      <div className="wrapper">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-blue-600 font-semibold text-lg mb-3">404 Error</p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-gray-500 text-base md:text-lg mb-8 leading-7">
            The page you are looking for does not exist or may have been moved.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/" className="custom-btn">
              Back to Home
            </Link>

            <Link to="/products" className="custom-btn-outline">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
