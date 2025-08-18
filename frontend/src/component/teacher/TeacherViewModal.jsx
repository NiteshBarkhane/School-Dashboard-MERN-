import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { images } from "../../assets/images";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { getTeacher } from "../../api/apis";
import { Loading } from "../";

const TeacherViewModal = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(true);
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const modalboxRef = useRef();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // Get user from database
  async function getUser() {
    setLoading(true);
    const request = requestHandler(getTeacher);
    request(teacherId)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Close model function
  function closeModal() {
    navigate(`/${loggedUser.role}/teacher/all`);
  }

  // Hold user if it fetched
  useEffect(() => {
    getUser();
  }, []);

  // Disable or close modal when clicked outside modal
  useEffect(() => {
    if (user) {
      document.body.style.overflow = "hidden"; // disable scroll
    } else {
      document.body.style.overflow = "auto"; // enable scroll
    }

    function handleClickOutside(event) {
      if (modalboxRef.current && !modalboxRef.current.contains(event.target))
        closeModal();
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div
          ref={modalboxRef}
          className="bg-white rounded-lg shadow-lg w-3/4 xl:w-1/2 p-6 pb-14 mt-5 relative animate-bottomSlideIn"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl"
          >
            ✖
          </button>

          {/* Modal title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">
            Teacher Details
          </h2>

          {/* Modal content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-6 bg-gray-100 rounded-lg border border-gray-300">
            {/* User Profile */}
            <div className="flex-shrink-0">
              <img
                src={user.profileImage || images.default_profile_avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-md"
              />
            </div>
            {/* User other details except profile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 flex-1 text-base">
              {Object.entries(user).map(([key, value]) => {
                if (key !== "profileImage") {
                  // Handle departments render of teacher separately because of differ data structure
                  if (key == "department") {
                    return (
                      <div key={key} className="flex flex-col">
                        <strong className="text-gray-800 font-bold mb-1 uppercase">
                          {key}:
                        </strong>
                        <span className="text-gray-700">
                          {value.length > 0
                            ? value.map((dept) => `${dept}, `)
                            : "none"}
                        </span>
                      </div>
                    );
                  }
                  // Handle qualifications render of teacher separately because of differ data structure
                  else if (key == "qualification") {
                    return (
                      <div key={key} className="flex flex-col">
                        <strong className="text-gray-800 font-bold mb-1 uppercase">
                          {key}:
                        </strong>
                        <span className="text-gray-700">
                          {value.length > 0
                            ? value.map((element) => `${element}, `)
                            : "none"}
                        </span>
                      </div>
                    );
                  }
                  // Render rest of fields
                  else {
                    return (
                      <div key={key} className="flex flex-col">
                        <strong className="text-gray-800 font-bold mb-1 uppercase">
                          {key}:
                        </strong>
                        <span className="text-gray-700">{value || "N/A"}</span>
                      </div>
                    );
                  }
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherViewModal;
