import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RightCard from "../components/RightCard";
import data from "../data/index.json";

const RightsList = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const cat = data.categories.find(c => c.slug === slug);
    setCategory(cat);
  }, [slug]);

  if (!category) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{category.title}</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {category.files.map(file => {
          const rightName = file.split("/")[1].replace(".json", "").replace(/_/g, " ");
          return (
            <RightCard
              key={file}
              categorySlug={slug}
              rightFile={file.split("/")[1]}
              rightTitle={rightName.charAt(0).toUpperCase() + rightName.slice(1)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RightsList;