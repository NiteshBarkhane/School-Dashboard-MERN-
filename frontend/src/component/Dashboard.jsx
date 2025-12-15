import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Card, Loading, MyHeader } from "../component";
import { useAuth } from "../context/authContext";
import { useRequestHandler } from "../utils/apiRequestHandler";
import { getAllRecords } from "../api/apis";

const initialData = {
  students: 0,
  teachers: 0,
  classes: 0,
  schedules: 0,
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(initialData);
  const { loggedUser } = useAuth();
  const requestHandler = useRequestHandler();

  // get all records Data
  function getAllRecordsData() {
    setLoading(true);
    const request = requestHandler(getAllRecords);
    request()
      .then((res) => {
        // toast.success(res.message);
        setDashboardData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // mounting effect
  useEffect(() => {
    getAllRecordsData();
  }, []);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full">
        <MyHeader title="Dashboard" icon="dashboard" />

        <div className="w-full my-7 grid grid-cols-4 gap-6 md:gap-10">
          <Card
            title="Students"
            icon="PiStudentBold"
            color="#9333ea"
            usersQuantity={dashboardData.students}
            path={`/${loggedUser.role}/student/all`}
          />
          <Card
            title="Teachers"
            icon="MdPeopleAlt"
            color="#16a34a"
            usersQuantity={dashboardData.teachers}
            path={`/${loggedUser.role}/teacher/all`}
          />
          <Card
            title="Classes"
            icon="FaChalkboardTeacher"
            color="orange"
            usersQuantity={dashboardData.classes}
            path={`/${loggedUser.role}/class/all`}
          />
          <Card
            title="Schedules"
            icon="RiCalendarScheduleFill"
            color="#536de6"
            usersQuantity={dashboardData.schedules}
            path={`/${loggedUser.role}/schedule/all`}
          />
        </div>

        {/* <div className="w-full grid grid-cols-2 gap-10 my-7">
        <div className="shadowbox w-full h-44 p-4">one</div>
        <div className="shadowbox w-full h-44 p-4">two</div>
      </div>

      <div className="w-full grid grid-cols-5 gap-10 my-7">
        <div className="shadowbox w-full h-44 p-4 col-span-3">one</div>
        <div className="shadowbox w-full h-44 p-4 col-span-2">two</div>
      </div> */}
      </div>
    </>
  );
};

export default Dashboard