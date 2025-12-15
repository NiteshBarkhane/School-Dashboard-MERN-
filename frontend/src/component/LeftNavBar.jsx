import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { Icons } from "../assets/icons/lcons";
import { images } from "../assets/images";
import { useAuth } from "../context/authContext";
import { AdminAndTeacherOnly, AdminOnly} from "./ui_restrictions";

// gives the value of window width.
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    // Cleanup
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

const LeftNavBar = () => {
  // all states and hooks
  const [openMenu, setOpenMenu] = useState(null);
  const [expandLeftbar, setExpandLeftbar] = useState(() =>
    window.screen.width >= 1024 ? true : false
  );
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");
  const activeMenuOption = useRef();
  const { loggedUser } = useAuth();

  // toggles sub-menu of nav menu
  function toggleMenu(menu) {
    setOpenMenu(openMenu === menu ? null : menu);
  }

  // expand leftNavBar automatically when is smaller than 1024px
  useEffect(() => {
    if (isSmallScreen) {
      setExpandLeftbar(false);
    } else {
      setExpandLeftbar(true);
    }
  }, [isSmallScreen]);

  // Close the menu options when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeMenuOption.current &&
        !activeMenuOption.current.contains(event.target) &&
        activeMenuOption &&
        !expandLeftbar
      ) {
         setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, expandLeftbar]);

  return (
    <div
      className={`${expandLeftbar === true ? "min-w-[270px]" : "w-[60px]"}
      w-[60px] lg:w-min-[270px] sticky top-0 h-screen bg-black text-custom_gray_500 font-semibold whitespace-nowrap transition-[width] duration-300 ease-linear`}
    >
      {/* Leftnav Profile */}
      <div className="hidden lg:block relative text-center px-[30px] py-[35px] bg-waves bg-no-repeat bg-[#ffffff21]">
        <a >
          {expandLeftbar && (
            <>
              <img
                src={loggedUser.profileImage || images.profile_avatar}
                className="shadow-shadow2 rounded-full w-12 mx-auto mb-2"
                alt="profile image"
              />
              <span className="text-slate-200 font-bold">
                {loggedUser.name}
              </span>
            </>
          )}
        </a>
        <button
          onClick={() =>
            setExpandLeftbar(expandLeftbar === true ? false : true)
          }
          className="hidden lg:inline absolute top-4 right-2 text-[40px]"
        >
          <Icons.IoArrowForwardCircleOutline
            className={`transition ${
              expandLeftbar ? "rotate-180" : ""
            } transition duration-500`}
          />
        </button>
      </div>

      {/* Left navigaton */}
      <ul className="sidenav py-5">
        {expandLeftbar && (
          <li className="p-3 pointer-events-none tracking-wide uppercase">
            Navigation
          </li>
        )}
        <li className="relative">
          <Link to={`/${loggedUser.role}/dashboard`} className="leftNavMenu">
            <Icons.BsSpeedometer2 className="text-2xl" />
            {expandLeftbar && <span>Dashboard</span>}
          </Link>
        </li>

        <AdminAndTeacherOnly>
          <li className="relative">
            <button
              onClick={() => toggleMenu("student")}
              className={`leftNavMenu ${
                openMenu === "student" ? "text-cyan-500" : ""
              } relative`}
            >
              <Icons.FaUserFriends className="text-2xl" />
              {expandLeftbar && (
                <>
                  <span>student</span>
                  <span className="absolute right-5">
                    <Icons.IoMdArrowDropright
                      className={` ${
                        openMenu === "student" ? "rotate-90" : ""
                      } transition`}
                    />
                  </span>
                </>
              )}
            </button>
            {openMenu === "student" && (
              <ul
                ref={activeMenuOption}
                className={`animate-dropdownIn ${
                  !expandLeftbar
                    ? "absolute bg-slate-800 top-0 left-[60px] "
                    : ""
                }`}
              >
                <AdminOnly>
                  <li>
                    <Link
                      to={`/${loggedUser.role}/student/create`}
                      className={`leftNavItem ${
                        !expandLeftbar ? "py-1 px-3" : ""
                      }`}
                    >
                      Add student
                    </Link>
                  </li>
                </AdminOnly>
                <li>
                  <Link
                    to={`/${loggedUser.role}/student/all`}
                    className={`leftNavItem ${
                      !expandLeftbar ? "py-1 px-3" : ""
                    }`}
                  >
                    All student
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </AdminAndTeacherOnly>

        <li className="relative">
          <button
            onClick={() => toggleMenu("teacher")}
            className={`leftNavMenu ${
              openMenu === "teacher" ? "text-cyan-500" : ""
            } relative`}
          >
            <Icons.FaChalkboardTeacher className="text-2xl" />
            {expandLeftbar && (
              <>
                <span>Teachers</span>
                <span className="absolute right-5">
                  <Icons.IoMdArrowDropright
                    className={` ${
                      openMenu === "teacher" ? "rotate-90" : ""
                    } transition`}
                  />
                </span>
              </>
            )}
          </button>
          {openMenu === "teacher" && (
            <ul
              ref={activeMenuOption}
              className={`animate-dropdownIn ${
                !expandLeftbar ? "absolute bg-slate-800 top-0 left-[60px] " : ""
              }`}
            >
              <AdminOnly>
                <li>
                  <Link
                    to={`/${loggedUser.role}/teacher/create`}
                    className={`leftNavItem ${
                      !expandLeftbar ? "py-1 px-3" : ""
                    }`}
                  >
                    Add teacher
                  </Link>
                </li>
              </AdminOnly>
              <li>
                <Link
                  to={`/${loggedUser.role}/teacher/all`}
                  className={`leftNavItem ${!expandLeftbar ? "py-1 px-3" : ""}`}
                >
                  All teacher
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="relative">
          <button
            onClick={() => toggleMenu("class")}
            className={`leftNavMenu ${
              openMenu === "class" ? "text-cyan-500" : ""
            } relative`}
          >
            <Icons.LuNotebookPen className="text-2xl" />
            {expandLeftbar && (
              <>
                <span>Classes</span>
                <span className="absolute right-5">
                  <Icons.IoMdArrowDropright
                    className={` ${
                      openMenu === "class" ? "rotate-90" : ""
                    } transition`}
                  />
                </span>
              </>
            )}
          </button>
          {openMenu === "class" && (
            <ul
              ref={activeMenuOption}
              className={`animate-dropdownIn ${
                !expandLeftbar ? "absolute bg-slate-800 top-0 left-[60px] " : ""
              }`}
            >
              <AdminOnly>
                <li>
                  <Link
                    to={`/${loggedUser.role}/class/create`}
                    className={`leftNavItem ${
                      !expandLeftbar ? "py-1 px-3" : ""
                    }`}
                  >
                    Add class
                  </Link>
                </li>
              </AdminOnly>
              <li>
                <Link
                  to={`/${loggedUser.role}/class/all`}
                  className={`leftNavItem ${!expandLeftbar ? "py-1 px-3" : ""}`}
                >
                  All class
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li className="relative">
          <button
            onClick={() => toggleMenu("schedule")}
            className={`leftNavMenu ${
              openMenu === "schedule" ? "text-cyan-500" : ""
            } relative`}
          >
            <Icons.RiCalendarScheduleFill className="text-2xl" />
            {expandLeftbar && (
              <>
                <span>Schedule</span>
                <span className="absolute right-5">
                  <Icons.IoMdArrowDropright
                    className={` ${
                      openMenu === "schedule" ? "rotate-90" : ""
                    } transition`}
                  />
                </span>
              </>
            )}
          </button>
          {openMenu === "schedule" && (
            <ul
              ref={activeMenuOption}
              className={`animate-dropdownIn ${
                !expandLeftbar ? "absolute bg-slate-800 top-0 left-[60px] " : ""
              }`}
            >
              <AdminOnly>
                <li>
                  <Link
                    to={`/${loggedUser.role}/schedule/create`}
                    className={`leftNavItem ${
                      !expandLeftbar ? "py-1 px-3" : ""
                    }`}
                  >
                    Create schedule
                  </Link>
                </li>
              </AdminOnly>
              <li>
                <Link
                  to={`/${loggedUser.role}/schedule/all`}
                  className={`leftNavItem ${!expandLeftbar ? "py-1 px-3" : ""}`}
                >
                  All schedule
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* <li className="relative">
          <button
            onClick={() => toggleMenu("settings")}
            className={`leftNavMenu ${
              openMenu === "settings" ? "text-cyan-500" : ""
            } relative`}
          >
            <Icons.IoSettings className="text-2xl" />
            {expandLeftbar && (
              <>
                <span>Settings</span>
                <span className="absolute right-5">
                  <Icons.IoMdArrowDropright
                    className={` ${
                      openMenu === "settings" ? "rotate-90" : ""
                    } transition`}
                  />
                </span>
              </>
            )}
          </button>
          {openMenu === "settings" && (
            <ul
              className={`animate-dropdownIn ${
                !expandLeftbar ? "absolute bg-slate-800 top-0 left-[60px] " : ""
              }`}
            >
              <li>
                <Link
                  to="/admin/school_settings"
                  className={`leftNavItem ${!expandLeftbar ? "py-1 px-3" : ""}`}
                >
                  School settings
                </Link>
              </li>
            </ul>
          )}
        </li> */}
      </ul>
    </div>
  );
};

export default LeftNavBar