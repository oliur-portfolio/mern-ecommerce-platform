import { FaRegHeart, FaRegUser, FaShoppingBag } from "react-icons/fa";
import { Link, NavLink, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../../api/auth.api";
import toast from "react-hot-toast";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { BsCart3 } from "react-icons/bs";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
  },
];

interface NavbarProps {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
}

const Navbar = ({ isMenuOpen, onToggleMenu }: NavbarProps) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartCount, clearCartOnLogout } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  const isProfileEditPage =
    location.pathname !== "/profile-edit" || user?.role === "user";

  const dropdownLinks =
    user?.role === "admin"
      ? [
          {
            label: "Admin Dashboard",
            href: "/admin-dashboard",
          },
        ]
      : [
          {
            label: "My Order",
            href: "/my-orders",
          },
        ];

  // Logout Mutation
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      logout();
      clearCartOnLogout();
      toast.success(data.message);
    },
    onError: () => {
      logout();
    },
  });

  return (
    <header
      className={`min-h-17 md:min-h-19.25 flex lg:items-center bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-40 ${isMobileMenu ? "h-screen" : "h-auto"}`}
    >
      <div className="wrapper">
        <nav className="flex flex-col lg:flex-row items-center lg:justify-between relative">
          <div className="flex items-center gap-4 md:gap-5 absolute top-4.25 md:top-4.75 left-0 lg:static">
            {isProfileEditPage && (
              <button
                onClick={() => {
                  if (onToggleMenu) {
                    onToggleMenu();
                    return;
                  }

                  setIsMobileMenu((prev) => !prev);
                }}
                className="flex items-center lg:hidden"
              >
                {(onToggleMenu ? isMenuOpen : isMobileMenu) ? (
                  <RxCross1 className="text-black w-6 h-6 md:w-7 md:h-7" />
                ) : (
                  <RxHamburgerMenu className="text-black w-6 h-6 md:w-7 md:h-7" />
                )}
              </button>
            )}

            {/* Logo */}
            <Link
              to={user?.role !== "admin" ? "/" : "/admin-dashboard"}
              className="flex items-center gap-2 md:gap-3"
            >
              <div className="w-8.5 h-8.5 md:w-10 md:h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                <FaShoppingBag className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>

              <h2 className="text-lg md:text-xl font-medium md:font-semibold text-gray-900">
                OliurShop
              </h2>
            </Link>
          </div>

          {/* Nav Links */}
          {user?.role !== "admin" && (
            <ul
              className={`lg:flex flex-col lg:flex-row items-center gap-8 md:gap-10 w-fit mt-30 lg:mt-0 ${isMobileMenu ? "flex" : "hidden"}`}
            >
              {navLinks.map((link) => (
                <li key={link.href} className="nav__link-item">
                  <NavLink
                    onClick={() => setIsMobileMenu(false)}
                    to={link.href}
                    end={link.href === "/"}
                    className={({ isActive }) =>
                      `nav__link ${isActive ? "nav__link--active" : ""}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}

          {/* Actions */}
          <div className="flex items-center gap-5 md:gap-6 absolute h-10 top-3.5 md:top-5 right-0 lg:static">
            {user?.role !== "admin" && (
              <>
                <Link
                  to="/wishlist"
                  className="relative text-gray-900 hover:text-blue-600 transition"
                >
                  <FaRegHeart className="w-5.5 h-5.5 md:w-6 md:h-6" />

                  {wishlistCount > 0 && (
                    <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-jost font-medium absolute -top-3 -right-3 z-10">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  className="relative text-gray-900 hover:text-blue-600 transition"
                >
                  <BsCart3 className="w-5.5 h-5.5 md:w-6 md:h-6" />

                  {cartCount > 0 && (
                    <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs font-jost font-medium absolute -top-3 -right-3 z-10">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <Menu>
                <MenuButton className="cursor-pointer flex items-center gap-3 outline-none">
                  <img
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    src={user?.avatar?.url || "/images/user.png"}
                    alt={user?.name}
                  />

                  <div className="hidden sm:block text-left">
                    <h3 className="text-base font-medium leading-none text-gray-900 capitalize">
                      {user?.name}
                    </h3>

                    {user?.role === "admin" && (
                      <p className="text-sm font-medium text-gray-500 capitalize mt-px">
                        {user?.role}
                      </p>
                    )}
                  </div>
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-52 origin-top-right rounded-xl border border-gray-200 shadow-xl text-sm text-gray-700 transition duration-100 ease-out [--anchor-gap:--spacing(2)] focus:outline-none data-closed:scale-95 data-closed:opacity-0 bg-white z-50 overflow-hidden"
                >
                  {dropdownLinks.map((link) => (
                    <MenuItem key={link.href}>
                      <Link
                        to={link.href}
                        className="block w-full px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 font-medium capitalize border-b border-gray-200"
                      >
                        {link.label}
                      </Link>
                    </MenuItem>
                  ))}

                  <MenuItem>
                    <Link
                      to="/profile-edit"
                      className="block w-full px-4 py-2.5 hover:bg-blue-50 hover:text-blue-600 font-medium capitalize border-b border-gray-200"
                    >
                      Profile edit
                    </Link>
                  </MenuItem>

                  <MenuItem>
                    <button
                      onClick={() => logoutMutation()}
                      className="block w-full text-left px-4 py-2.5 hover:bg-red-50 hover:text-red-600 font-medium capitalize cursor-pointer"
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="text-gray-900 hover:text-blue-600 transition"
              >
                <FaRegUser className="w-5.5 h-5.5 md:w-6 md:h-6" />
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
