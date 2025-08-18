import React from "react";
import { LeftNavBar, Topbar } from "../component";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      {/* Top Bar */}
      <Topbar />

      <div className="w-full">
        <div className="w-full h-full flex">
          {/* leftBar */}
          <LeftNavBar />
          {/* Rigth Content */}
          <div className="w-full p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard