import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { getSchedule } from "../../api/apis";
import { Loading } from "../";
import toast, { Toaster } from "react-hot-toast";

const ScheduleViewModal = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const { scheduleId } = useParams();
  const navigate = useNavigate();
  const modalboxRef = useRef();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // Get scheduleData from database
  async function getScheduleData() {
    setLoading(true);
    const request = requestHandler(getSchedule);
    request(scheduleId)
      .then((res) => {
        const formattedData = Object.entries(res.data).flatMap(
          ([key, value]) => {
            if (Array.isArray(value)) {
              return [[key, value]];
            } else if (typeof value === "object" && value !== null) {
              return Object.entries(value).map(([subKey, subVal]) => [
                `${key}.${subKey}`,
                subVal,
              ]);
            } else {
              return [[key, value]];
            }
          }
        );

        setScheduleData(formattedData);
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
    navigate(`/${loggedUser.role}/schedule/all`);
  }

  // Hold scheduleData if it fetched
  useEffect(() => {
    getScheduleData();
  }, []);

  // Disable or close modal when clicked outside modal
  useEffect(() => {
    if (scheduleData) {
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

  if (!scheduleData) return null;

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div
          ref={modalboxRef}
          className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 p-6 pb-14 mt-5 relative animate-bottomSlideIn"
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
            Schedule Details
          </h2>

          {/* Modal content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-6 bg-gray-100 rounded-lg border border-gray-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 flex-1 text-base">
              {scheduleData &&
                scheduleData.map((fields, index) => {
                  if (Array.isArray(fields[1])) {
                    return (
                      <div key={index} className="">
                        <strong className="text-gray-800 font-bold mb-1 mr-2 uppercase">
                          {fields[0]}:
                        </strong>
                        <ul className="text-gray-700 list-disc ml-5">
                          {fields[1].map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="">
                        <strong className="text-gray-800 font-bold mb-1 mr-2 uppercase">
                          {fields[0]}:
                        </strong>
                        <span className="text-gray-700">
                          {fields[1] || "N/A"}
                        </span>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScheduleViewModal