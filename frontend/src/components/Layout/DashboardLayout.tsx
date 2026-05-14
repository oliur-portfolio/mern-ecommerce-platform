import { Outlet } from "react-router";
import AdminSidebar from "../Header/AdminSidebar";
import Navbar from "../Header/Navbar";
import { useState } from "react";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar
        isMenuOpen={isSidebarOpen}
        onToggleMenu={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex mt-17 md:mt-19.25">
        <AdminSidebar
          isSidebarOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 relative overflow-auto pt-10 px-6 md:px-10 pb-20">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
