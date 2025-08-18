import React from "react";
import { useAuth } from "../../context/authContext";

const StudentRestrict = ({ children }) => {
  const { loggedUser } = useAuth();

  if (loggedUser.role !== "student") {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default StudentRestrict