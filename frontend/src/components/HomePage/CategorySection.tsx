import { BsHandbagFill } from "react-icons/bs";
import { FaCouch, FaMobileAlt, FaShoePrints, FaTshirt } from "react-icons/fa";
import { Link } from "react-router";

const categories = [
  {
    id: 1,
    title: "Clothing",
    icon: <FaTshirt className="w-7 h-7 text-blue-600" />,
    href: "/products?category=clothing",
  },
  {
    id: 2,
    title: "Shoes",
    icon: <FaShoePrints className="w-7 h-7 text-blue-600" />,
    href: "/products?category=shoes",
  },
  {
    id: 3,
    title: "Accessories",
    icon: <BsHandbagFill className="w-7 h-7 text-blue-600" />,
    href: "/products?category=accessories",
  },
  {
    id: 4,
    title: "Home",
    icon: <FaCouch className="w-7 h-7 text-blue-600" />,
    href: "/products?category=home",
  },
  {
    id: 5,
    title: "Electronics",
    icon: <FaMobileAlt className="w-7 h-7 text-blue-600" />,
    href: "/products?category=electronics",
  },
];

const CategorySection = () => {
  return (
    <section className="pt-16">
      <div className="wrapper">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">Categories</h2>
          <p className="text-gray-500 mt-1">
            Browse products by your favorite category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.href}
              className="group bg-white border border-gray-200 rounded-2xl p-6 min-h-36 flex flex-col items-center justify-center text-center hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition"
            >
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-100 transition">
                {category.icon}
              </div>

              <h3 className="text-base font-medium text-gray-700 group-hover:text-blue-600 transition">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
