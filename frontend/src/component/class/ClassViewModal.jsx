import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { getClass } from "../../api/apis";
import { Loading } from "../";

const ClassViewModal = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState(true);
  const { classId } = useParams();
  const navigate = useNavigate();
  const modalboxRef = useRef();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // Get classData from database
  async function getClassData() {
    setLoading(true);
    const request = requestHandler(getClass);
    request(classId)
      .then((res) => {
        console.log(res);
        // toast.success(res.message);
        setClassData(res.data);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Close model function
  function closeModal() {
    navigate(`/${loggedUser.role}/class/all`);
  }

  // Hold classData if it fetched
  useEffect(() => {
    getClassData();
  }, []);

  // Disable or close modal when clicked outside modal
  useEffect(() => {
    if (classData) {
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

  if (!classData) return null;

  return (
    <>
      {loading ? <Loading /> : ""}
      <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div
          ref={modalboxRef}
          className="bg-white rounded-lg shadow-lg w-2/5 p-6 pb-14 mt-5 relative animate-bottomSlideIn"
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
            Class Details
          </h2>

          {/* Modal content */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 p-6 bg-gray-100 rounded-lg border border-gray-300">
            <table className="gap-y-4 gap-x-16 text-base w-full text-center border-spacing-9">
              {/* table headings */}
              <thead className="text-gray-800 font-bold uppercase border-b border-b-slate-300 border-solid">
                <tr>
                  <td className="p-2 content-start">Class</td>
                  <td className="p-2 content-start">Section</td>
                  <td className="p-2 content-start">Subject</td>
                </tr>
              </thead>
              {/* table content */}
              <tbody className="font-semibold text-gray-700">
                <tr>
                  {/* class name */}
                  <td className="p-2 content-start">
                    {classData.name || "N/A"}
                  </td>
                  {/* class section */}
                  <td className="p-2 content-start">
                    <ul className="list-disc">
                      {classData?.section?.length > 0 &&
                        classData.section.map((sec, index) => (
                          <li key={index} className="p-1.5">
                            {sec}
                          </li>
                        ))}
                    </ul>
                  </td>
                  {/* class subject */}
                  <td className="p-2 content-start">
                    <ul className="list-disc">
                      {classData?.subject?.length &&
                        classData.subject.map((sub, index) => (
                          <li key={index} className="p-1.5">
                            {sub}
                          </li>
                        ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassViewModal