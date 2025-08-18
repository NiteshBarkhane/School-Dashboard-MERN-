import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../assets/icons/lcons";

const Card = ({
  title = "",
  icon = "",
  color = "",
  usersQuantity = 0,
  path = "",
  className = "",
}) => {
  const Icon = Icons[icon];
  return (
    <Link
      to={path}
      style={{ backgroundColor: color }}
      className={`w-full p-2 md:p-4 min-h-14 md:min-h-24 text-white font-extrabold text-2xl text-center rounded-lg ${className}`}
    >
      <div className="w-full flex justify-center items-center gap-3 text-2xl md:text-4xl mb-1 md:mb-3">
        <Icon />
        <span className="text-sm sm:text-2xl">{usersQuantity}</span>
      </div>
      <span className="sm:tracking-wider text-base md:text-2xl">{title}</span>
    </Link>
  );
};

export default Card