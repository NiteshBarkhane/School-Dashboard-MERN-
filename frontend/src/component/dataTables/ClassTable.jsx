import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Icons } from "../../assets/icons/lcons";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { deleteClass, getAllClass } from "../../api/apis";
import { Pagination, Loading } from "../";
import { AdminOnly, AdminAndTeacherOnly } from "../ui_restrictions";

const ClassTable = () => {
  // All the states that handles table
  const [loading, setLoading] = useState(false);
  const [classData, setClassData] = useState([]);
  const [activeOption, setActiveOptions] = useState(null); // Hold the option element that is currently visible.
  const [listingClasses, setListingClasses] = useState([]); // Class that are actually visible on table.
  const [currentPage, setCurrentPage] = useState(1); // Hold value of current page related to pagination.
  const [noOfListing, setNoOfListing] = useState(5); // Number of entries visible on table at once.
  const activeOptionRef = useRef(); // This reference is used by the studentClass option component.
  const navigate = useNavigate();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // Update the classData that are actually get to visible depending on current page value and current number of listing value.
  function updateListingClasses() {
    setListingClasses(
      classData.slice(
        currentPage * noOfListing - noOfListing,
        currentPage * noOfListing
      )
    );
  }

  // Update the listingClasses, if the query string of search bar is found into whole classData data. Or if it get empty query string it will automatically calls updateListingClasses()
  function handleSearch(queryString) {
    if (queryString)
      setListingClasses(
        classData.filter((studentClass) =>
          studentClass.name.toLowerCase().includes(queryString.toLowerCase())
        )
      );
    else updateListingClasses();
  }

  // Toggles the option for the studentClass on which it get click.
  function toggleOption(id) {
    setActiveOptions(activeOption == id ? null : id);
  }

  // Get all studentClass from database
  async function getAllClassesData() {
    setLoading(true);
    const request = requestHandler(getAllClass);
    request()
      .then((res) => {
        setClassData(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Show the view modal for the studentClass who clicks on view profile.
  function handleViewModal(classId) {
    navigate(`/${loggedUser.role}/class/view/${classId}`);
  }

  // Edit studentClass
  function handleEdit(classId) {
    navigate(`/${loggedUser.role}/class/edit/${classId}`);
  }

  // Delete studentClass
  async function handleDelete(classId) {
    setLoading(true);
    const request = requestHandler(deleteClass);
    request(classId)
      .then((res) => {
        console.log(res);
        toast.success(res.message);
        getAllClassesData();
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Close the options when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeOptionRef.current &&
        !activeOptionRef.current.contains(event.target)
      )
        setActiveOptions(null);
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all teachers
  useEffect(() => {
    getAllClassesData();
  }, []);

  // Set listing classData when the table is render. And update the listing classData when the current page and noOfListing are changes.
  useEffect(() => {
    updateListingClasses();
  }, [currentPage, noOfListing, classData]);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="text-sm">
        {/* Header of table */}
        <div className="flex justify-between my-4 font-semibold">
          {/* all number of entries per page */}
          <div>
            <span>Show</span>
            <select
              defaultValue={noOfListing}
              onChange={(e) => setNoOfListing(e.target.value.trim())}
              className="border border-solid border-gray-300 rounded-md py-1 px-3 mx-1"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
            <span>entries</span>
          </div>
          {/* Search bar */}
          <div>
            <label htmlFor="search">Search:</label>
            <input
              type="text"
              id="search"
              name="search"
              onChange={(event) => handleSearch(event.target.value)}
              className="border border-solid border-gray-300 rounded-md p-1 ml-2"
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full border-b border-collapse border-b-slate-300 border-solid text-center">
          <thead className="text-gray-200 bg-slate-800 text-base">
            <tr className="grid grid-cols-5">
              <th className="p-4">Code</th>
              <th className="p-4">Class</th>
              <th className="p-4">Section</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Option</th>
              {/* add more column heading here.. */}
            </tr>
          </thead>

          <tbody className="font-semibold">
            {/* Mapping studentClass rows in current page */}
            {listingClasses.map((studentClass, index) => (
              <tr
                key={studentClass._id}
                className={`grid grid-cols-5 ${
                  index % 2 == 0 ? "bg-zinc-100" : ""
                }`}
              >
                <td className="p-4">{studentClass._id}</td>
                <td className="p-4">{studentClass.name}</td>
                <td className="p-4">{studentClass.section.toString()}</td>
                <td className="p-4">{studentClass.subject.toString()}</td>
                {/* Add more data columns here..*/}

                <td className="p-4 text-center whitespace-normal overflow-visible text-clip">
                  <div className="relative w-fit mx-auto">
                    {/* Class option toggle button */}
                    <button
                      className="px-4 py-2 border border-solid border-gray-400 rounded-sm text-xl hover:bg-slate-500 focus:bg-slate-500 focus:text-white hover:text-white transition"
                      onClick={() => toggleOption(studentClass._id)}
                    >
                      <Icons.SlOptions />
                    </button>
                    {/* Class option box */}
                    {activeOption == studentClass._id && (
                      <div
                        ref={activeOptionRef}
                        className="animate-slideUp py-1 z-10 bg-white w-fit min-w-32 absolute border-[1px] border-solid border-[#e7ebf0] "
                      >
                        <div>
                          <button
                            onClick={() => handleViewModal(studentClass._id)}
                            className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                          >
                            <Icons.IoEye />
                            <span>View</span>
                          </button>
                          <AdminAndTeacherOnly>
                            <button
                              onClick={() => handleEdit(studentClass._id)}
                              className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                            >
                              <Icons.MdModeEdit />
                              <span>Edit</span>
                            </button>
                          </AdminAndTeacherOnly>
                          <AdminOnly>
                            <button
                              onClick={() => handleDelete(studentClass._id)}
                              className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3 text-red-600"
                            >
                              <Icons.MdDelete />
                              <span>Delete</span>
                            </button>
                          </AdminOnly>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          totalItem={classData.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          noOfListing={noOfListing}
        />
      </div>
    </>
  );
};

export default ClassTable;
