import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyHeader } from "../../component";

const StudentAdmission = ({ children }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState("");
  const [path, setPath] = useState(null);

  function handleTab(tabName) {
    setTab(tabName);
  }

  useEffect(() => {
    setPath(location.pathname);
    if (tab == "create") navigate("/admin/user/student/create");
    else if (tab == "bulk") navigate("/admin/user/student/create/bulk");
    else if (tab == "excel") navigate("/admin/user/student/create/excel");
  }, [tab, location.pathname]);

  return (
    <div className="w-full">
      <MyHeader title="Student admission form" icon="IoIosPersonAdd" />

      {/* Multi-step container  */}
      <div className="w-full my-7">
        <div className="w-full grid grid-cols-3 justify-center items-center text-center">
          <button
            onClick={() => handleTab("create")}
            className={`py-3 font-semibold ${
              path === "/admin/user/student/create"
                ? "bg-blue-500 text-white"
                : "hover:text-blue-500 transition duration-300 ease-linear"
            }`}
          >
            Single student admission
          </button>
          <button
            onClick={() => handleTab("bulk")}
            className={`py-3 font-semibold  ${
              path === "/admin/user/student/create/bulk"
                ? "bg-blue-500 text-white"
                : "hover:text-blue-500 transition duration-300 ease-linear"
            }`}
          >
            Bulk student admission
          </button>
          <button
            onClick={() => handleTab("excel")}
            className={`py-3 font-semibold ${
              path === "/admin/user/student/create/excel"
                ? "bg-blue-500 text-white"
                : "hover:text-blue-500 transition duration-300 ease-linear"
            }`}
          >
            Excel upload
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default StudentAdmission