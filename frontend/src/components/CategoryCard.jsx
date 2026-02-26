import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => (
  <Link to={`/category/${category.slug}`}>
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition cursor-pointer">
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{category.icon}</div>
        <div>
          <h2 className="text-xl font-semibold">{category.title}</h2>
          <p className="text-gray-500">{category.description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default CategoryCard;