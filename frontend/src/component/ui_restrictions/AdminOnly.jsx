import React from "react";
import { useAuth } from "../../context/authContext";

const AdminOnly = ({ children }) => {
  const { loggedUser } = useAuth();

  if (loggedUser.role === "admin") {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default AdminOnly