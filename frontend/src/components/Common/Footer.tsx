const Footer = () => {
  return (
    <footer className="bg-gray-900">
      <div className="wrapper py-6 text-center">
        <p className="text-sm font-medium text-gray-400">
          © {new Date().getFullYear()} OliurShop. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
