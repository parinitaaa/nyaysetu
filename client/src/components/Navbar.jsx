import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="bg-blue-600 text-white p-4 shadow-md">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">NyaySetu</Link>
      <div>Know Your Rights</div>
    </div>
  </nav>
);

export default Navbar;