import React from "react";
import { Link } from "react-router-dom";

// Define the props type
interface CategoryCardProps {
  title: string;
  description: string;
  slug: string;
  icon: React.ReactNode; // Can be JSX, string, or an icon component
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, description, slug, icon }) => (
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