// components/Breadcrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumbs = ({ items }) => {
  return (
    <nav className="max-w-7xl mx-auto px-6 bg-white  flex items-center text-gray-600 my-2">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.link ? (
            <Link to={item.link} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-800">{item.label}</span>
          )}
          {idx < items.length - 1 && <IoIosArrowForward size={14} className="mx-2" />}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
