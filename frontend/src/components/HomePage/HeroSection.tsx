import { Link } from "react-router";
import { RiShieldFlashLine } from "react-icons/ri";
import { TfiReload } from "react-icons/tfi";
import { IoPricetagOutline } from "react-icons/io5";

const HeroSection = () => {
  return (
    <section className="py-26 md:py-50 hero-bg">
      <div className="wrapper">
        <div className="relative z-10 flex items-center">
          <div className="max-w-170 text-white">
            <p className="text-base md:text-lg font-medium mb-3 text-blue-300">
              New Collection 2026
            </p>

            <h1 className="text-3xl md:text-5xl font-semibold leading-snug md:leading-tight text-white mb-5 md:mb-8">
              Discover Premium Fashion For Everyday Style
            </h1>

            <p className="text-base md:text-lg text-gray-200 lg:text-gray-300 mb-5 md:mb-8 font-medium">
              Explore trendy clothing, accessories, and essentials crafted for
              comfort and style.
            </p>

            <Link
              to="/products"
              className="custom-btn h-12 px-12 text-base leading-none"
            >
              Shop Now
            </Link>

            <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-5 md:gap-16 mt-8 md:mt-10">
              <div className="flex items-center gap-3 relative hero__feature-border">
                <RiShieldFlashLine className="w-6 h-6 md:w-8 md:h-8" />
                <span className="flex-1 text-sm md:text-base text-gray-200 lg:text-gray-300 font-medium leading-normal">
                  Premium Quality
                </span>
              </div>
              <div className="flex items-center gap-3 relative hero__feature-border">
                <TfiReload className="w-6 h-6 md:w-8 md:h-8" />
                <span className="flex-1 text-sm md:text-base text-gray-200 lg:text-gray-300 font-medium leading-normal">
                  Easy 30-Day Returns
                </span>
              </div>
              <div className="flex items-center gap-3 relative hero__feature-border">
                <IoPricetagOutline className="w-6 h-6 md:w-8 md:h-8" />
                <span className="flex-1 text-sm md:text-base text-gray-200 lg:text-gray-300 font-medium leading-normal">
                  Best Prices
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
