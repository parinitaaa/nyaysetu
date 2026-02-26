import React from "react";
import CategoryCard from "../components/CategoryCard";
import data from "../data/index.json";

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Rights Categories</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.categories.map(category => (
          <CategoryCard key={category.categoryId} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Home;