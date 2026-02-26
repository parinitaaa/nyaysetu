import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RightCard from "../components/RightCard";

const RightsList = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5004/rights/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch category data");
        return res.json();
      })
      .then((data) => {
        setCategory(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>Loading category...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!category?.rights?.length) return <p>No rights found for this category.</p>;

  return (
    <div className="rights-page">
      <h1 className="rights-header h1">{category.category}</h1>
      <div className="rights-grid">
        {category.rights.map((right) => (
          <RightCard
            key={right.slug}
            categorySlug={slug}
            rightFile={right.slug}
            rightTitle={right.title}
            summary={right.summary}
            severity={right.severity}
          />
        ))}
      </div>
    </div>
  );
};

export default RightsList;