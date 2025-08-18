import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { createSchedule, getAllClass, getAllTeacher } from "../../api/apis";
import toast, { Toaster } from "react-hot-toast";
import { Loading } from "..";

const initialFormState = {
  name: "",
  time: "",
  day: [],
  class: "",
  section: [],
  teacher: "",
  subject: "",
};

const timings = [
  "10:00 AM - 10:40 AM",
  "10:40 AM - 11:20 AM",
  "11:20 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "01:00 PM - 01:40 PM",
  "01:40 PM - 02:00 PM",
];

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ScheduleCreateModal = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState(initialFormState);
  const [selectedSection, setSelectedSection] = useState(
    initialFormState.section
  );
  const [selectedDay, setSelectedDay] = useState(initialFormState.day);
  const [classAndSection, setClassAndSection] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sections, setSections] = useState([]);
  const navigate = useNavigate();
  const modalboxRef = useRef();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // handle input data
  function handleInput(event) {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  }

  // handle section
  function handleSection(section) {
    if (section == "All") {
      selectedSection.length == sections.length
        ? setSelectedSection([])
        : setSelectedSection(sections);
    } else {
      if (selectedSection.includes(section))
        setSelectedSection(selectedSection.filter((dept) => dept !== section));
      else setSelectedSection([...selectedSection, section]);
    }
  }

  //   handle days
  function handleDay(day) {
    if (day == "All") {
      selectedDay.length == 6 ? setSelectedDay([]) : setSelectedDay(days);
    } else {
      if (selectedDay.includes(day))
        setSelectedDay(selectedDay.filter((dept) => dept !== day));
      else setSelectedDay([...selectedDay, day]);
    }
  }

  // handle submit
  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedDay.length) {
      alert("Select atleast one day!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    for (const key in inputData) {
      formData.append(key, inputData[key]);
    }
    // for (const [key, value] of formData) {
    //   console.log(key, ": ", value);
    // }
    const request = requestHandler(createSchedule);
    request(formData)
      .then((res) => {
        console.log(res);
        toast.success(res.message);
        navigate(`/${loggedUser.role}/schedule/view/${res.data._id}`);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });

    resetForm();
  }

  // reset form
  function resetForm() {
    setInputData(initialFormState);
    setSelectedSection(initialFormState.section);
    setSelectedDay(initialFormState.day);
  }

  function getTeachersAndClassesData() {
    setLoading(true);
    const request1 = requestHandler(getAllClass);
    request1()
      .then((res) => {
        console.log(res.data);
        // toast.success(res.message);
        setClassAndSection(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.success(res.message);
      });
    const request2 = requestHandler(getAllTeacher);
    request2()
      .then((res) => {
        console.log(res.data);
        // toast.success(res.message);
        setTeachers(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.success(res.message);
      });

    setLoading(false);
  }

  // Close model function
  function closeModal() {
    navigate(`/${loggedUser.role}/schedule/all`);
  }

  // Disable or close modal when clicked outside modal
  useEffect(() => {
    document.body.style.overflow = "hidden"; // disable scroll
    // document.body.style.overflow = "auto"; // enable scroll

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

  // mounting effect
  useEffect(() => {
    getTeachersAndClassesData();
  }, []);

  // Show sections dynamically when class is changed
  useEffect(() => {
    if (classAndSection.length > 0) {
      const allSectionOfSelectedClass = classAndSection.filter(
        (element) => element._id === inputData.class
      );
      setSections(allSectionOfSelectedClass[0]?.section);
    }
  }, [inputData.class]);

  // update selectedDay and selectedSection in inputData
  useEffect(() => {
    setInputData({ ...inputData, day: selectedDay, section: selectedSection });
  }, [selectedDay, selectedSection]);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="fixed inset-0 z-50 flex items-start justify-end bg-black bg-opacity-50 backdrop-blur-sm overflow-y-scroll">
        <div
          ref={modalboxRef}
          className="bg-white rounded-l-lg shadow-lg min-w-fit w-1/4 min-h-screen h-fit pt-6 px-3 relative animate-rightSlideIn"
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-3 left-4 text-gray-500 hover:text-red-500 text-2xl"
          >
            ✖
          </button>

          {/* Modal title */}
          <h2 className="text-2xl text-gray-700 font-semibold mb-4 text-center">
            Create schedule
          </h2>

          {/* Modal content */}
          <form
            className="flex flex-col items-center gap-8 py-6 px-3"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex flex-col gap-3 justify-center text-base">
              {/* schedule name */}
              <div>
                <label className="text-sm">
                  Name
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>
                <input
                  type="text"
                  className="input w-full"
                  name="name"
                  value={inputData.name}
                  onChange={handleInput}
                  placeholder="Enter class name"
                  required
                />
              </div>
              {/* class */}
              <div>
                <label htmlFor="class" className="text-sm">
                  Class
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>

                <select
                  className="input appearance-none"
                  id="class"
                  placeholder="class"
                  name="class"
                  value={inputData.class}
                  onChange={handleInput}
                  required
                >
                  <option value="" disabled selected>
                    Select a class
                  </option>
                  {classAndSection.length > 0 &&
                    classAndSection.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}th
                      </option>
                    ))}
                </select>
              </div>
              {/* section */}
              <div>
                <label className="text-sm">
                  section
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>
                <ul className="w-full">
                  <li className="flex justify-between gap-5">
                    <label htmlFor="allSections">All</label>
                    <input
                      type="checkbox"
                      id="allSections"
                      checked={selectedSection?.length === sections?.length}
                      onChange={() => handleSection("All")}
                    />
                  </li>
                  {sections.length > 0 &&
                    sections.map((section, index) => (
                      <li key={index} className="flex justify-between gap-5">
                        <label htmlFor={index}>{section}</label>
                        <input
                          type="checkbox"
                          id={index}
                          name="section"
                          value={section}
                          checked={selectedSection.includes(section)}
                          onChange={() => handleSection(section)}
                        />
                      </li>
                    ))}
                </ul>
              </div>

              {/* subject */}
              <div>
                <label htmlFor="subject" className="text-sm">
                  Subject
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>

                <select
                  className="input appearance-none"
                  id="subject"
                  placeholder="subject"
                  name="subject"
                  value={inputData.subject}
                  onChange={handleInput}
                  required
                >
                  <option value="" disabled selected>
                    Select a subject
                  </option>
                  {classAndSection.length > 0 &&
                    classAndSection
                      .filter((element) => element._id === inputData.class)
                      .flatMap((element) =>
                        element.subject.map((item, index) => (
                          <option key={index} value={item}>
                            {item}
                          </option>
                        ))
                      )}
                </select>
              </div>
              {/* teacher */}
              <div>
                <label htmlFor="teacher" className="text-sm">
                  Teacher
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>

                <select
                  className="input appearance-none"
                  id="teacher"
                  placeholder="teacher"
                  name="teacher"
                  value={inputData.teacher}
                  onChange={handleInput}
                  required
                >
                  <option value="" disabled selected>
                    Select a teacher
                  </option>
                  {teachers.length > 0 &&
                    teachers.map((element) => (
                      <option key={element._id} value={element._id}>
                        {element.name}
                      </option>
                    ))}
                </select>
              </div>
              {/* time */}
              <div>
                <label className="text-sm">
                  Time
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>
                <select
                  className="input appearance-none"
                  placeholder="time"
                  name="time"
                  value={inputData.time}
                  onChange={handleInput}
                  required
                >
                  <option value="" disabled selected>
                    Select a time
                  </option>
                  {timings.length > 0 &&
                    timings.map((element, index) => (
                      <option key={index} value={element}>
                        {element}
                      </option>
                    ))}
                </select>
              </div>
              {/* day */}
              <div>
                <label className="text-sm">
                  day
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>
                <ul className="w-full">
                  <li className="flex justify-between gap-5">
                    <label htmlFor="alldays">All</label>
                    <input
                      type="checkbox"
                      id="alldays"
                      checked={selectedDay.length === 6}
                      onChange={() => handleDay("All")}
                    />
                  </li>
                  {days.length > 0 &&
                    days.map((day, index) => (
                      <li key={index} className="flex justify-between gap-5">
                        <label htmlFor={day}>{day}</label>
                        <input
                          type="checkbox"
                          id={day}
                          name="day"
                          value={day}
                          checked={selectedDay.includes(day)}
                          onChange={() => handleDay(day)}
                        />
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            {/* submit */}
            <div>
              <input
                className="btnAdd px-4 text-lg"
                type="submit"
                value="Create"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ScheduleCreateModal;
