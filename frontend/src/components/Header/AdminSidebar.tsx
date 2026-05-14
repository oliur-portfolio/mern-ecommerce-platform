import { Link, useLocation } from "react-router";

interface INavItem {
  id: number;
  title: string;
  href: string;
}

const navItems: INavItem[] = [
  {
    id: 1,
    title: "Dashboard",
    href: "/admin-dashboard",
  },
  {
    id: 2,
    title: "Products",
    href: "/admin-products",
  },
  {
    id: 3,
    title: "Orders",
    href: "/admin-orders",
  },
  {
    id: 4,
    title: "Users",
    href: "/admin-users",
  },
];

interface AdminSidebarProps {
  isSidebarOpen: boolean;
  onClose?: () => void;
}

const AdminSidebar = ({ isSidebarOpen, onClose }: AdminSidebarProps) => {
  const location = useLocation();

  return (
    <div
      className={`w-full max-w-62.5 h-[calc(100vh-68px)] md:h-[calc(100vh-77px)] bg-white xl:sticky top-17 md:top-19.25 p-5 border-r border-gray-200 fixed z-50 transition-all duration-300 ease-in-out xl:left-0 ${isSidebarOpen ? "left-0" : "-left-full"}`}
    >
      <ul className="flex flex-col gap-3">
        {navItems.map((nav: INavItem) => (
          <li key={nav.id}>
            <Link
              onClick={onClose}
              to={nav.href}
              className={`text-base md:text-lg font-medium py-2.5 px-4 md:py-3 block rounded-lg transition-all duration-100 ease-in-out ${location.pathname === nav.href ? "bg-blue-600 text-white" : ""}`}
            >
              {nav.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSidebar;
