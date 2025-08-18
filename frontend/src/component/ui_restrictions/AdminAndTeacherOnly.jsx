import React from "react";
import { useAuth } from "../../context/authContext";

const AdminAndTeacherOnly = ({ children }) => {
  const { loggedUser } = useAuth();

  if (loggedUser.role === "admin" || loggedUser.role === "teacher") {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default AdminAndTeacherOnly