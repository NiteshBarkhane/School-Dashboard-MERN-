import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Icons } from "../../assets/icons/lcons";
import { images } from "../../assets/images";
import { MyHeader } from "../../component";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { useAuth } from "../../context/authContext";
import { getTeacher, updateTeacher } from "../../api/apis";
import { Loading } from "../";

const initialFormState = {
  name: "",
  email: "",
  qualification: "",
  dob: "",
  phone: "",
  gender: "",
  bloodGroup: "",
  address: "",
  about: "",
  department: [],
  profileImage: "",
};

const departments = ["Department 1", "Department 2", "Department 3"];

const EditTeacher = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState(initialFormState);
  const [profileImage, setProfileImage] = useState(
    initialFormState.profileImage
  );
  const [selectedDepartment, setSelectedDepartment] = useState(
    initialFormState.department
  );
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const requestHandler = useRequestHandler();
  const { loggedUser } = useAuth();

  // handle form inputs
  function handleInput(event) {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  }

  // handle profile image field
  function handleImage(event) {
    if (event.target.files[0]) {
      setInputData({ ...inputData, profileImage: event.target.files[0] });
      setProfileImage(URL.createObjectURL(event.target.files[0]));
    }
  }

  // handle department field
  function handleDepartment(department) {
    if (department == "none")
      setSelectedDepartment(initialFormState.department);
    else {
      if (selectedDepartment.includes(department))
        setSelectedDepartment(
          selectedDepartment.filter((dept) => dept !== department)
        );
      else setSelectedDepartment([...selectedDepartment, department]);
    }
  }

  // get teacher data from database
  async function getTeacherData() {
    setLoading(true);
    const request = requestHandler(getTeacher);
    request(teacherId)
      .then((res) => {
        setInputData(res.data);
        setProfileImage(res.data.profileImage);
        setSelectedDepartment(res.data.department);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // handle form submit
  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (const key in inputData) {
      formData.append(key, inputData[key]);
    }
    // for (const [key, values] of formData) {
    //   console.log(key, ": ", values);
    // }

    const request = requestHandler(updateTeacher);
    request(teacherId, formData)
      .then((res) => {
        toast.success(res.message);
        navigate(`/${loggedUser.role}/teacher/view/${res.data._id}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        resetForm();
      });
  }

  // reset form
  function resetForm() {
    setInputData(initialFormState);
    setSelectedDepartment(initialFormState.department);
    setProfileImage(initialFormState.profileImage);
  }

  // mounting effects
  useEffect(() => {
    getTeacherData();
  }, []);

  // update selected department in inputData
  useEffect(() => {
    setInputData({ ...inputData, department: selectedDepartment });
  }, [selectedDepartment]);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <MyHeader title="Edit teacher form" icon="FaUserEdit" />
      <div className="w-full shadowbox mb-8 p-7">
        <form className="md:text-lg" onSubmit={handleSubmit}>
          {/* name */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="input"
              type="text"
              id="name"
              placeholder="name"
              name="name"
              value={inputData.name}
              onChange={handleInput}
              required
            />
          </div>
          {/* email */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              placeholder="email"
              name="email"
              value={inputData.email}
              onChange={handleInput}
              required
            />
          </div>
          {/* qualification */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="qualification"
            >
              Qualification
            </label>
            <input
              className="input"
              type="text"
              id="qualification"
              placeholder="enter qualification"
              name="qualification"
              value={inputData.qualification}
              onChange={handleInput}
            />
          </div>
          {/* dob */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="dob"
            >
              Date of birth
            </label>
            <input
              className="input appearance-none"
              type="date"
              id="dob"
              placeholder="DOB"
              name="dob"
              value={inputData.dob}
              onChange={handleInput}
              required
            />
          </div>
          {/* gender */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              className="input appearance-none"
              id="gender"
              placeholder="gender"
              name="gender"
              value={inputData.gender}
              onChange={handleInput}
              required
            >
              <option value="" disabled selected>
                Select a gender
              </option>
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </select>
          </div>
          {/* bloodGroup */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="blood_group"
            >
              Blood Group
            </label>
            <select
              className="input appearance-none"
              id="blood_group"
              placeholder="blood_group"
              name="bloodGroup"
              value={inputData.bloodGroup}
              onChange={handleInput}
            >
              <option value="" disabled selected>
                Select a blood group
              </option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O-">O-</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          {/* address */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="address"
            >
              Address
            </label>
            <textarea
              className="input h-32"
              id="address"
              placeholder="address"
              name="address"
              value={inputData.address}
              onChange={handleInput}
              required
            />
          </div>
          {/* about */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="about"
            >
              About
            </label>
            <textarea
              className="input h-32"
              id="about"
              placeholder="about"
              name="about"
              value={inputData.about}
              onChange={handleInput}
            />
          </div>
          {/* phone */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className="input"
              type="tel"
              id="phone"
              placeholder="phone"
              name="phone"
              value={inputData.phone}
              onChange={handleInput}
              required
            />
          </div>
          {/* department */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
            <label
              className="block w-full md:w-[20%] font-semibold"
              htmlFor="none"
            >
              Department
            </label>
            <div className="w-full flex justify-start gap-4 items-center">
              <span>
                <label htmlFor="none">
                  None
                  <input
                    type="checkbox"
                    id="none"
                    checked={selectedDepartment.length === 0}
                    onChange={() => handleDepartment("none")}
                  />
                </label>
              </span>
              {departments.length > 0 &&
                departments.map((dept, index) => (
                  <span key={index}>
                    <label htmlFor={dept}>{dept}</label>
                    <input
                      type="checkbox"
                      id={dept}
                      name="department"
                      value={dept}
                      checked={selectedDepartment.includes(dept)}
                      onChange={() => handleDepartment(dept)}
                    />
                  </span>
                ))}
            </div>
          </div>
          {/* profileImage */}
          <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <span className="block w-full md:w-[20%] font-semibold">
              Profile image
            </span>
            <div className="w-full p-2">
              <div className="w-60 p-3 shadow-shadow3 rounded-sm">
                <img
                  src={profileImage || images.default_profile_avatar}
                  alt="upload image"
                  className="w-full"
                />
                <label
                  htmlFor="profile_image"
                  className="cursor-pointer flex items-center justify-start gap-2"
                >
                  <Icons.IoCameraOutline />
                  <span>Change Image</span>
                </label>
                <input
                  className="hidden border-[1px] border-slate-300 rounded-md text-md"
                  type="file"
                  id="profile_image"
                  placeholder="profile_image"
                  onChange={handleImage}
                  accept="image/*"
                />
              </div>
            </div>
          </div>
          {/* submit */}
          <div className="m-2 p-2 flex justify-center items-start gap-20">
            <input
              type="submit"
              value="Edit teacher"
              className="btnAdd rounded-md w-40"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTeacher;
