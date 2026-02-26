import React from "react";
import { Link } from "react-router-dom";

const RightCard = ({ categorySlug, rightFile, rightTitle, summary, severity }) => {
  return (
    <div className="rights-card">
      <h2 className="rights-card h2">{rightTitle}</h2>
      <p className="rights-card-desc">{summary}</p>
      <p className="mt-1 text-sm font-medium text-red-500">{severity}</p>
      <Link
        to={`/category/${categorySlug}/${rightFile}`}
        className="text-blue-500 underline mt-2 inline-block"
      >
        View Details
      </Link>
    </div>
  );
};

export default RightCard;