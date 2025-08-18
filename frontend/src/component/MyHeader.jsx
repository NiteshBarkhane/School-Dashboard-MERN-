import React from "react";
import { Link } from "react-router-dom";
import { Icons } from "../assets/icons/lcons";
import { AdminOnly } from "./ui_restrictions";

const MyHeader = ({
  title = "",
  icon = "",
  btnTitle = "",
  path = "",
}) => {
  const HeaderIcon = Icons[icon];

  return (
    <div className="shadowbox px-6 py-4 my-7 w-full h-20 flex justify-between items-center ">
      <div className="flex items-center gap-3 text-lg md:text-2xl font-bold">
        <HeaderIcon />
        <span>{title}</span>
      </div>

      <AdminOnly>
        {btnTitle && path && (
          <Link
            to={path}
            className="text-[#536de6] hover:bg-[#536de6] hover:text-white border-[1px] p-2 border-[#536de6] flex justify-center items-center gap-2 transition duration-300"
          >
            <Icons.IoMdAdd />
            <span>{btnTitle}</span>
          </Link>
        )}
      </AdminOnly>
    </div>
  );
};

export default MyHeader