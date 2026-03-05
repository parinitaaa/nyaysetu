import React from "react";
import { Link } from "react-router-dom";

// Define the props type
interface RightCardProps {
  categorySlug: string;
  rightFile: string;
  rightTitle: string;
  summary: string;
  severity?: string; // optional if not always provided
}

const RightCard: React.FC<RightCardProps> = ({ categorySlug, rightFile, rightTitle, summary, severity }) => {
  return (
    <div className="rights-card">
      <h2 className="rights-card h2">{rightTitle}</h2>
      <p className="rights-card-desc">{summary}</p>
      {severity && <p className="mt-1 text-sm font-medium text-red-500">{severity}</p>}
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