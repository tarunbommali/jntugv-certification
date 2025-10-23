/* eslint-disable no-unused-vars */
// components/Breadcrumbs.jsx
import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { global_classnames } from "../../../utils/classnames"; 

const Breadcrumbs = ({ items }) => {
  return (
    <nav className={`flex items-center text-gray-600  py-4 `}>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.link ? (
            <Link to={item.link} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-800">{item.label}</span>
          )}
          {idx < items.length - 1 && <IoIosArrowForward size={14} className="mx-1" />}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
