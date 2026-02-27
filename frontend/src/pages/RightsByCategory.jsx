import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRightsByCategory } from "../api/rightsApi";

function RightsByCategory() {
  const { category_slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getRightsByCategory(category_slug).then(setData);
  }, [category_slug]);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">

      <Link
        to="/rights"
        className="text-blue-600 hover:underline"
      >
        ← Back to Categories
      </Link>

      <h1 className="text-3xl font-bold text-blue-700">
        {data.category}
      </h1>

      {data.rights.map((right) => (
        <Link
          key={right.slug}
          to={`/rights/${category_slug}/${right.slug}`}
          className="block bg-white shadow-md border border-blue-100 rounded-xl p-6 hover:shadow-lg transition"
        >
          <h2 className="font-semibold text-blue-700">
            {right.title}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {right.summary}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default RightsByCategory;