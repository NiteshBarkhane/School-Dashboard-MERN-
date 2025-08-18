import { MyHeader } from "..";
import { useAuth } from "../../context/authContext";
import { StudentTable } from "../dataTables";

const Student = () => {
  const { loggedUser } = useAuth();

  return (
    <div className="w-full">
      {/* header */}
      <MyHeader
        title="Student"
        icon="FaUserGraduate"
        btnTitle="Create new student"
        path={`/${loggedUser.role}/student/create`}
      />

      <div className="w-full shadowbox p-7">
        <StudentTable />
      </div>
    </div>
  );
};

export default Student