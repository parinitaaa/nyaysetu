import React from "react";
import { Link } from "react-router-dom";

const RightCard = ({ categorySlug, rightFile, rightTitle }) => (
  <Link to={`/category/${categorySlug}/${rightFile}`}>
    <div className="bg-white shadow rounded-md p-4 hover:bg-blue-50 transition cursor-pointer">
      <h3 className="text-lg font-medium">{rightTitle}</h3>
    </div>
  </Link>
);

export default RightCard;