import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { images } from "../assets/images";
import { Icons } from "../assets/icons/lcons";
import { logout } from "../api/apis";
import { Loading } from "./";
import { useAuth } from "../context/authContext";
import { useRequestHandler } from "../utils/apiRequestHandler";

const Topbar = () => {
  const [profileMenu, setProfileMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const myRef = useRef();
  const { loggedUser, setLoggedUser } = useAuth();
  const requestHandler = useRequestHandler();

  // Toggle button handler
  const handleToggle = () => {
    setProfileMenu((prev) => !prev);
  };

  function handleLogout() {
    setLoading(true);
    const request = requestHandler(logout);

    request()
      .then((res) => {
        console.log(res);
        toast.success(res.message);
        setLoggedUser(null);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (myRef.current && !myRef.current.contains(event.target)) {
        setProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-[#313a46] text-font-white shadow-shadow2">
        <div className="container">
          <div className="flex w-full justify-between items-center mx-auto">
            <div className="flex items-center ">
              <span className="lg:hidden text-white font-normal text-lg">
                <img src={images.capLogo} width={"70%"} alt="logo-light-sm" />
              </span>
              <span className="hidden lg:inline text-white font-normal text-xl">
                <img src={images.softrivat} width={"150px"} alt="logo-light3" />
              </span>
            </div>

            <div ref={myRef} className="flex gap-8 items-center">
              <Link to="/" className="btn hidden lg:block">
                Visit Website
              </Link>
              <div className="relative">
                <button
                  onClick={handleToggle}
                  className="flex justify-center items-center gap-2.5 bg-[#3c4654] p-5"
                >
                  <img
                    src={loggedUser.profileImage || images.profile_avatar}
                    alt="profile"
                    className="w-9 rounded-full"
                  />
                  <div
                    className={`
                    ${
                      profileMenu == true
                        ? "text-custom_white"
                        : "text-[#98a6ad]"
                    } 
                   transition duration-200 text-left hidden lg:block`}
                  >
                    <div className="text-sm font-semibold">
                      {loggedUser.name}
                    </div>
                    <div className="text-xs">{loggedUser.email}</div>
                  </div>
                </button>
                {profileMenu && (
                  <div className="animate-slideUp py-1 bg-white w-fit min-w-44 absolute right-0 border-[1px] border-solid border-[#e7ebf0] ">
                    <div className="py-3 px-4 text-[0.75rem] font-bold">
                      Welcome !
                    </div>
                    <ul>
                      <Link
                        to={`/${loggedUser.role}/profile`}
                        className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                      >
                        <Icons.FaCircleUser />
                        <span>My Account</span>
                      </Link>
                      {/* <Link className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3">
                        <Icons.FaEarthAmericas />
                        <span>Support</span>
                      </Link> */}
                      <button
                        className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                        onClick={handleLogout}
                      >
                        <Icons.MdLogout />
                        <span>Logout</span>
                      </button>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar