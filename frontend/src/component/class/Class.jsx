import React from "react";
import { MyHeader } from "../../component";
import { ClassTable } from "../dataTables";
import { useAuth } from "../../context/authContext";

const Class = () => {
  const { loggedUser } = useAuth();

  return (
    <div className="w-full">
      <MyHeader
        title="Classes"
        icon="FaBookReader"
        btnTitle="Create new class"
        path={`/${loggedUser.role}/class/create`}
      />

      <div className="w-full shadowbox mb-8 p-7">
        <ClassTable />
      </div>
    </div>
  );
};

export default Class