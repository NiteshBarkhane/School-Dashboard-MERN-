import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Icons } from "../../assets/icons/lcons";
import { useAuth } from "../../context/authContext";
import { deleteStudent, getAllStudent } from "../../api/apis";
import { Pagination, Loading } from "../";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { AdminOnly, AdminAndTeacherOnly } from "../ui_restrictions";

const StudentTable = () => {
  // All the states that handles table
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [activeOption, setActiveOptions] = useState(null); // Hold the option element that is currently visible.
  const [listingUsers, setListingUsers] = useState([]); // User that are actually visible on table.
  const [currentPage, setCurrentPage] = useState(1); // Hold value of current page related to pagination.
  const [noOfListing, setNoOfListing] = useState(5); // Number of entries visible on table at once.
  const activeOptionRef = useRef(); // This reference is used by the user option component.
  const requestHandler = useRequestHandler();
  const navigate = useNavigate();
  const { loggedUser } = useAuth();

  // Update the users that are actually get to visible depending on current page value and current number of listing value.
  function updateListingUsers() {
    setListingUsers(
      users.slice(
        currentPage * noOfListing - noOfListing,
        currentPage * noOfListing
      )
    );
  }

  // Update the listingUsers, if the query string of search bar is found into whole users data. Or if it get empty query string it will automatically calls updateListingUsers()
  function handleSearch(queryString) {
    if (queryString)
      setListingUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(queryString.toLowerCase())
        )
      );
    else updateListingUsers();
  }

  // Toggles the option for the user on which it get click.
  function toggleOption(id) {
    setActiveOptions(activeOption == id ? null : id);
  }

  // Get all student from database
  async function getStudentsData() {
    setLoading(true);
    const request = requestHandler(getAllStudent);
    request()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Show the view modal for the user who clicks on view profile.
  function handleViewModal(userId) {
    navigate(`/${loggedUser.role}/student/view/${userId}`);
  }

  // Edit user
  function handleEdit(userId) {
    navigate(`/${loggedUser.role}/student/edit/${userId}`);
  }

  // Delete user
  async function handleDelete(userId) {
    setLoading(true);
    const request = requestHandler(deleteStudent);
    request(userId)
      .then((res) => {
        toast.success(res.message);
        getStudentsData();
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

  // Fetch all students
  useEffect(() => {
    getStudentsData();
  }, []);

  // Set listing users when the table is render. And update the listing users when the current page and noOfListing are changes.
  useEffect(() => {
    updateListingUsers();
  }, [currentPage, noOfListing, users]);

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
        <table className="w-full border-b border-collapse border-b-slate-300 border-solid">
          <thead className="text-left text-gray-200 bg-slate-800 text-base">
            <tr className="grid grid-cols-5">
              <th className="p-4">Code</th>
              <th className="p-4 text-center">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Option</th>
              {/* add more column heading here.. */}
            </tr>
          </thead>

          <tbody className="font-semibold">
            {/* Mapping user rows in current page */}
            {listingUsers.map((student, index) => (
              <tr
                key={student._id}
                className={`grid grid-cols-5 ${
                  index % 2 == 0 ? "bg-zinc-100" : ""
                }`}
              >
                <td className="p-4">{student._id}</td>
                <td className="p-4">
                  <div className="w-14 mx-auto rounded-full border border-solid border-gray-300 overflow-hidden">
                    <img
                      src={student.profileImage}
                      alt="Student image"
                      className="w-full transform scale-110"
                    />
                  </div>
                </td>
                <td className="p-4">{student.name}</td>
                <td className="p-4">{student.email}</td>
                {/* Add more data columns here..*/}

                <td className="p-4 text-center whitespace-normal overflow-visible text-clip">
                  <div className="relative w-fit mx-auto">
                    {/* User option toggle button */}
                    <button
                      className="px-4 py-2 border border-solid border-gray-400 rounded-sm text-xl hover:bg-slate-500 focus:bg-slate-500 focus:text-white hover:text-white transition"
                      onClick={() => toggleOption(student._id)}
                    >
                      <Icons.SlOptions />
                    </button>
                    {/* User option box */}
                    {activeOption == student._id && (
                      <div
                        ref={activeOptionRef}
                        className="animate-slideUp py-1 z-10 bg-white w-fit min-w-32 absolute border-[1px] border-solid border-[#e7ebf0] "
                      >
                        <div>
                          <button
                            onClick={() => handleViewModal(student._id)}
                            className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                          >
                            <Icons.IoEye />
                            <span>View</span>
                          </button>
                          <AdminAndTeacherOnly>
                            <button
                              onClick={() => handleEdit(student._id)}
                              className="w-full hover:bg-[#f4f6fb] cursor-pointer hover:text-[#2d343f] p-1.5 px-5 flex items-center gap-3"
                            >
                              <Icons.MdModeEdit />
                              <span>Edit</span>
                            </button>
                          </AdminAndTeacherOnly>
                          <AdminOnly>
                            <button
                              onClick={() => handleDelete(student._id)}
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

        {/* pagination for table */}
        <Pagination
          totalItem={users.length}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          noOfListing={noOfListing}
        />
      </div>
    </>
  );
};

export default StudentTable;
