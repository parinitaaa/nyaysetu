import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RightDetail = () => {
  const { slug, rightFile } = useParams();
  const [rightData, setRightData] = useState(null);

  useEffect(() => {
    import(`../data/${slug}/${rightFile}.json`)
      .then(module => setRightData(module.default))
      .catch(err => console.error(err));
  }, [slug, rightFile]);

  if (!rightData) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{rightData.title}</h1>
      <p className="text-gray-700 mb-6">{rightData.description}</p>

      {rightData.sections && rightData.sections.map((section, index) => (
        <div key={index} className="mb-4">
          <h2 className="text-xl font-semibold mb-1">{section.heading}</h2>
          <p className="text-gray-600">{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default RightDetail;