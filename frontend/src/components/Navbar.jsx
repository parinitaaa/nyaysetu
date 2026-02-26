import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav className="navbar">
    <div className="container mx-auto flex justify-between items-center">
      <Link to="/" className="navbar a">NyaySetu</Link>
      <div>Know Your Rights</div>
    </div>
  </nav>
);

export default Navbar;