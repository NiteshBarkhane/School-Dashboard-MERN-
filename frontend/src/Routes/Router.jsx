import React, { lazy, Suspense, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "../context/authContext";

// These imports used when we don't using lazy loading just for arranged and structured import
// import { Dashboard, Home } from "../pages";
// import {
//   Dashboard as DashboardContent,
//   Student,
//   EditStudent,
//   Teacher,
//   AddTeacher,
//   EditTeacher,
//   Login,
//   AddStudent,
//   Class,
//   PageNoteFound,
//   Schedule,
//   UserProfile,
//   ClassCreateModal,
//   ClassEditModal,
//   ClassViewModal,
//   ScheduleCreateModal,
//   ScheduleEditModal,
//   ScheduleViewModal,
//   StudentViewModal,
//   TeacherViewModal,
// } from "../component";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Home = lazy(() => import("../pages/Home"));
const DashboardContent = lazy(() => import("../component/Dashboard"));
const Student = lazy(() => import("../component/student/Student"));
const AddStudent = lazy(() => import("../component/student/AddStudent"));
const EditStudent = lazy(() => import("../component/student/EditStudent"));
const StudentViewModal = lazy(() =>
  import("../component/student/StudentViewModal")
);
const Teacher = lazy(() => import("../component/teacher/Teacher"));
const AddTeacher = lazy(() => import("../component/teacher/AddTeacher"));
const EditTeacher = lazy(() => import("../component/teacher/EditTeacher"));
const TeacherViewModal = lazy(() =>
  import("../component/teacher/TeacherViewModal")
);
const Schedule = lazy(() => import("../component/schedule/Schedule"));
const ScheduleCreateModal = lazy(() =>
  import("../component/schedule/ScheduleCreateModal")
);
const ScheduleEditModal = lazy(() =>
  import("../component/schedule/ScheduleEditmodal")
);
const ScheduleViewModal = lazy(() =>
  import("../component/schedule/ScheduleViewModal")
);
const Login = lazy(() => import("../component/Login"));
const Class = lazy(() => import("../component/class/Class"));
const ClassCreateModal = lazy(() =>
  import("../component/class/ClassCreateModal")
);
const ClassEditModal = lazy(() => import("../component/class/ClassEditModal"));
const ClassViewModal = lazy(() => import("../component/class/ClassViewModal"));
const PageNoteFound = lazy(() => import("../component/PageNoteFound"));
const UserProfile = lazy(() => import("../component/UserProfile"));
const Loading = lazy(() => import("../component/Loading"));

// RedirectIfUnauthorized
export function RedirectIfUnauthorized({ children }) {
  const { loggedUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !loggedUser &&
      (location.pathname.split("/").includes("admin") ||
        location.pathname.split("/").includes("teacher") ||
        location.pathname.split("/").includes("student"))
    ) {
      navigate("/login");
    }
  }, [loggedUser, location.pathname]);

  return children;
}

export const Routing = () => {
  const { loggedUser } = useAuth();

  return (
    <Router>
      <RedirectIfUnauthorized>
        <Suspense fallback={<div>My Load</div>}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />

            {loggedUser && loggedUser.role === "admin" && (
              <Route path="/admin" element={<Dashboard />}>
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="profile" element={<UserProfile />} />

                <Route path="student">
                  <Route path="all" element={<Student />} />
                  <Route path="create" element={<AddStudent />} />
                  <Route path="edit/:studentId" element={<EditStudent />} />
                  <Route
                    path="view/:studentId"
                    element={<StudentViewModal />}
                  />
                </Route>

                <Route path="teacher">
                  <Route path="all" element={<Teacher />} />
                  <Route path="create" element={<AddTeacher />} />
                  <Route
                    path="view/:teacherId"
                    element={<TeacherViewModal />}
                  />
                  <Route path="edit/:teacherId" element={<EditTeacher />} />
                </Route>

                <Route path="class">
                  <Route path="all" element={<Class />} />
                  <Route path="create" element={<ClassCreateModal />} />
                  <Route path="view/:classId" element={<ClassViewModal />} />
                  <Route path="edit/:classId" element={<ClassEditModal />} />
                </Route>

                <Route path="schedule">
                  <Route path="all" element={<Schedule />} />
                  <Route path="create" element={<ScheduleCreateModal />} />
                  <Route
                    path="view/:scheduleId"
                    element={<ScheduleViewModal />}
                  />
                  <Route
                    path="edit/:scheduleId"
                    element={<ScheduleEditModal />}
                  />
                </Route>
              </Route>
            )}

            {loggedUser && loggedUser.role === "teacher" && (
              <Route path="/teacher" element={<Dashboard />}>
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="profile" element={<UserProfile />} />

                <Route path="student">
                  <Route path="all" element={<Student />} />
                  <Route path="create" element={<AddStudent />} />
                  <Route path="edit/:studentId" element={<EditStudent />} />
                  <Route
                    path="view/:studentId"
                    element={<StudentViewModal />}
                  />
                </Route>

                <Route path="teacher">
                  <Route path="all" element={<Teacher />} />
                  <Route path="create" element={<AddTeacher />} />
                  <Route
                    path="view/:teacherId"
                    element={<TeacherViewModal />}
                  />
                  <Route path="edit/:teacherId" element={<EditTeacher />} />
                </Route>

                <Route path="class">
                  <Route path="all" element={<Class />} />
                  <Route path="create" element={<ClassCreateModal />} />
                  <Route path="view/:classId" element={<ClassViewModal />} />
                  <Route path="edit/:classId" element={<ClassEditModal />} />
                </Route>

                <Route path="schedule">
                  <Route path="all" element={<Schedule />} />
                  <Route path="create" element={<ScheduleCreateModal />} />
                  <Route
                    path="view/:scheduleId"
                    element={<ScheduleViewModal />}
                  />
                  <Route
                    path="edit/:scheduleId"
                    element={<ScheduleEditModal />}
                  />
                </Route>
              </Route>
            )}

            {loggedUser && loggedUser.role === "student" && (
              <Route path="/student" element={<Dashboard />}>
                <Route path="dashboard" element={<DashboardContent />} />
                <Route path="profile" element={<UserProfile />} />

                <Route path="student">
                  <Route path="all" element={<Student />} />
                  <Route path="create" element={<AddStudent />} />
                  <Route path="edit/:studentId" element={<EditStudent />} />
                  <Route
                    path="view/:studentId"
                    element={<StudentViewModal />}
                  />
                </Route>

                <Route path="teacher">
                  <Route path="all" element={<Teacher />} />
                  <Route path="create" element={<AddTeacher />} />
                  <Route
                    path="view/:teacherId"
                    element={<TeacherViewModal />}
                  />
                  <Route path="edit/:teacherId" element={<EditTeacher />} />
                </Route>

                <Route path="class">
                  <Route path="all" element={<Class />} />
                  <Route path="create" element={<ClassCreateModal />} />
                  <Route path="view/:classId" element={<ClassViewModal />} />
                  <Route path="edit/:classId" element={<ClassEditModal />} />
                </Route>

                <Route path="schedule">
                  <Route path="all" element={<Schedule />} />
                  <Route path="create" element={<ScheduleCreateModal />} />
                  <Route
                    path="view/:scheduleId"
                    element={<ScheduleViewModal />}
                  />
                  <Route
                    path="edit/:scheduleId"
                    element={<ScheduleEditModal />}
                  />
                </Route>
              </Route>
            )}

            {/* Wrong route */}
            <Route path="*" element={<PageNoteFound />} />
          </Routes>
        </Suspense>
      </RedirectIfUnauthorized>
    </Router>
  );
};
