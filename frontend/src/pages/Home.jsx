import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5004/rights/categories") // backend API
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1 className="text-4xl font-bold mb-6">Know Your Rights</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.slug}
            title={category.title}
            description={category.description}
            slug={category.slug}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;