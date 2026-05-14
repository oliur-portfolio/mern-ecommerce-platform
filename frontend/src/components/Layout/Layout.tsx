import { Outlet } from "react-router";
import Navbar from "../Header/Navbar";
import Footer from "../Common/Footer";

const Layout = () => {
  return (
    <>
      <Navbar />

      <main className="mt-17 md:mt-19.25 min-h-[calc(100vh-68px)] md:min-h-[calc(100vh-77px)]">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default Layout;
