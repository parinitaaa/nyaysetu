import { useEffect, useState } from "react";
import { getCategories } from "../api/rightsApi";
import { Link } from "react-router-dom";

function RightsCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">

      <h1 className="text-4xl font-bold text-blue-700">
        Explore Your Legal Rights
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/rights/${cat.slug}`}
            className="bg-white shadow-md border border-blue-100 rounded-2xl p-6 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-blue-700">
              {cat.title}
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RightsCategories;