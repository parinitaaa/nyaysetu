import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ title, description, slug, icon }) => (
  <Link to={`/category/${slug}`}>
    <div className="category-card">
      <div className="flex items-center space-x-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <h2 className="category-card h2">{title}</h2>
          <p className="category-card p">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default CategoryCard;