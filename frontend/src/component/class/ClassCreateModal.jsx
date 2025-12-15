import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { createClass } from "../../api/apis";
import { Loading } from "../";

const initialFormState = {
  name: "",
  section: ["A"],
  subject: [],
};

const ClassCreateModal = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState(initialFormState);
  const [selectedSection, setSelectedSection] = useState(
    initialFormState.section
  );
  const [selectedSubject, setSelectedSubject] = useState(
    initialFormState.subject
  );
  const modalboxRef = useRef();
  const navigate = useNavigate();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // hnadle input data like class
  function handleInput(event) {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  }

  // handle UI and values of sections
  function handleSection(event, index = null) {
    const { name } = event.target;
    // add new section field
    if (name === "addSection") {
      setSelectedSection([...selectedSection, ""]);
    }
    // remove section field
    else if (name === "deleteSection" && index !== null) {
      setSelectedSection(selectedSection.filter((_, i) => i !== index));
    }
    // update section field
    else if (index !== null) {
      setSelectedSection(
        selectedSection.map((section, i) =>
          i === index ? (section = event.target.value) : section
        )
      );
    }
  }

  // handle UI and values of subjects
  function handleSubject(event, index = null) {
    const { name } = event.target;
    // add new subject field
    if (name === "addSubject") {
      setSelectedSubject([...selectedSubject, ""]);
    }
    // remove subject field
    else if (name === "deleteSubject" && index !== null) {
      setSelectedSubject(selectedSubject.filter((_, i) => i !== index));
    }
    // update subject field
    else if (index !== null) {
      setSelectedSubject(
        selectedSubject.map((subject, i) =>
          i === index ? (subject = event.target.value) : subject
        )
      );
    }
  }

  // handle submit
  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (const key in inputData) {
      formData.append(key, inputData[key]);
    }
    // for (const [key, value] of formData) {
    //   console.log(key, ": ", value);
    // }
    const request = requestHandler(createClass);
    request(formData)
      .then((res) => {
        toast.success(res.message);
        navigate(`/${loggedUser.role}/class/view/${res.data._id}`);
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
    setSelectedSubject(initialFormState.subject);
  }

  // Close model function
  function closeModal() {
    navigate(`/${loggedUser.role}/class/all`);
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

  // update selectedSection and selectedSubject in inputData
  useEffect(() => {
    setInputData({
      ...inputData,
      section: selectedSection,
      subject: selectedSubject,
    });
  }, [selectedSection, selectedSubject]);

  return (
    <>
      {loading ? <Loading /> : ""}
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
            Create class
          </h2>

          {/* Modal content */}
          <form
            className="flex flex-col items-center gap-8 py-6 px-3"
            onSubmit={handleSubmit}
          >
            <div className="w-full flex flex-col gap-3 justify-center text-base">
              {/* class name */}
              <div>
                <label htmlFor="name" className="text-sm">
                  Name
                  <span className="text-red-700 text-lg ml-1">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="input w-full"
                  name="name"
                  value={inputData.name}
                  onChange={handleInput}
                  placeholder="Enter class name"
                  required
                />
              </div>
              {/* Section */}
              <ul>
                <label htmlFor="name" className="text-sm">
                  Section
                </label>
                <li className="border border-solid border-gray-300 flex mb-2">
                  <input
                    type="text"
                    value={inputData.section[0]}
                    disabled={true}
                    className="w-full pl-3"
                  />
                  <button
                    className="px-4 py-2 bg-green-600 text-white text-2xl"
                    type="button"
                    name="addSection"
                    onClick={handleSection}
                  >
                    &#43;
                  </button>
                </li>
                {selectedSection.length > 1 &&
                  selectedSection.map((item, index) => {
                    if (index === 0) return;
                    return (
                      <li
                        key={index}
                        className="border border-solid border-gray-300 flex mb-2"
                      >
                        <input
                          type="text"
                          className="w-full pl-3"
                          name={index}
                          value={item}
                          onChange={(e) => handleSection(e, index)}
                        />
                        <button
                          className="px-4 py-2 bg-red-600 text-white text-2xl"
                          type="button"
                          value={index}
                          name="deleteSection"
                          onClick={(e) => handleSection(e, index)}
                        >
                          &#215;
                        </button>
                      </li>
                    );
                  })}
              </ul>
              {/* Subject */}
              <ul>
                <label htmlFor="name" className="text-sm">
                  Subject (optional)
                </label>
                {selectedSubject.length > 0 &&
                  selectedSubject.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="border border-solid border-gray-300 flex mb-2"
                      >
                        <input
                          type="text"
                          className="w-full pl-3"
                          name={index}
                          value={item}
                          onChange={(e) => handleSubject(e, index)}
                        />
                        <button
                          className="px-4 py-2 bg-red-600 text-white text-2xl"
                          type="button"
                          value={index}
                          name="deleteSubject"
                          onClick={(e) => handleSubject(e, index)}
                        >
                          &#215;
                        </button>
                      </li>
                    );
                  })}
                <li className="border border-solid border-gray-300 flex mb-2">
                  <button
                    className="w-full px-4 py-1.5 bg-blue-500 text-white text-2xl"
                    type="button"
                    name="addSubject"
                    onClick={handleSubject}
                  >
                    <>&#43;</>
                  </button>
                </li>
              </ul>
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

export default ClassCreateModal