import { MyHeader } from "..";
import { useAuth } from "../../context/authContext";
import { ScheduleTable } from "../dataTables";

const Schedule = () => {
  const { loggedUser } = useAuth();

  return (
    <div className="w-full">
      {/* header   */}
      <MyHeader
        title="Schedules"
        icon="RiCalendarScheduleFill"
        btnTitle="Create new schedule"
        path={`/${loggedUser.role}/schedule/create`}
      />

      <div className="w-full shadowbox mb-8 p-7">
        <ScheduleTable />
      </div>
    </div>
  );
};

export default Schedule