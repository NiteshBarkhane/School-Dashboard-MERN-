import React, { useEffect, useState } from "react";
import { images } from "../../assets/images";
import { Icons } from "../../assets/icons/lcons";
import { MyHeader } from "../";
import { useRequestHandler } from "../../utils/apiRequestHandler";
import { getAllClass, registerStudent } from "../../api/apis";
import { Loading } from "../";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import toast, { Toaster } from "react-hot-toast";

const initialFormState = {
  name: "",
  email: "",
  password: "",
  fatherName: "",
  motherName: "",
  class: "",
  section: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  address: "",
  phone: "",
  profileImage: "",
};

const AddStudent = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState(initialFormState);
  const [profileImage, setProfileImage] = useState(
    initialFormState.profileImage
  );
  const [classAndSection, setClassAndSection] = useState([]);
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

  // get available classes data
  async function getClassAndSection() {
    setLoading(true);
    const request = requestHandler(getAllClass);
    request()
      .then((res) => {
        setClassAndSection(res.data);
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
    // for (const [key, value] of formData) {
    //   console.log(key, ": ", value);
    // }
    const request = requestHandler(registerStudent);
    request(formData)
      .then((res) => {
        toast.success(res.message);
        navigate(`/${loggedUser.role}/student/view/${res.data._id}`);
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
    setProfileImage(initialFormState.profileImage);
  }

  // mounting effects
  useEffect(() => {
    getClassAndSection();
  }, []);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="w-full">
        {/* Header */}
        <MyHeader title="Add student form" icon="PiStudentBold" />

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
            {/* password */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
              <label
                className="block w-full md:w-[20%] font-semibold"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="input"
                type="password"
                id="password"
                placeholder="password"
                name="password"
                value={inputData.password}
                onChange={handleInput}
                required
              />
            </div>
            {/* father */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
              <label
                className="block w-full md:w-[20%] font-semibold"
                htmlFor="father_name"
              >
                Father Name
              </label>
              <input
                className="input"
                type="text"
                id="father_name"
                placeholder="enter name"
                name="fatherName"
                value={inputData.fatherName}
                onChange={handleInput}
              />
            </div>
            {/* mother */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
              <label
                className="block w-full md:w-[20%] font-semibold"
                htmlFor="mother_name"
              >
                Mother name
              </label>
              <input
                className="input"
                type="text"
                id="mother_name"
                placeholder="enter name"
                name="motherName"
                value={inputData.motherName}
                onChange={handleInput}
              />
            </div>
            {/* class */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
              <label
                className="block w-full md:w-[20%] font-semibold"
                htmlFor="class"
              >
                Class
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
                    <option key={item._id} value={item.name}>
                      {item.name}th
                    </option>
                  ))}
              </select>
            </div>
            {/* section */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center  md:gap-20">
              <label
                className="block w-full md:w-[20%] font-semibold"
                htmlFor="section"
              >
                Section
              </label>
              <select
                className="input appearance-none"
                id="section"
                placeholder="section"
                name="section"
                value={inputData.section}
                onChange={handleInput}
                required
              >
                <option value="" disabled selected>
                  Select a section
                </option>
                {classAndSection.length > 0 &&
                  classAndSection
                    .filter((element) => element.name === inputData.class)
                    .flatMap((element) =>
                      element.section.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))
                    )}
              </select>
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
            {/* profileImage */}
            <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
              <span className="block w-full md:w-[20%] font-semibold">
                Profile image
              </span>
              <div className="w-full p-2">
                <div className="w-60 p-3 shadow-shadow3 rounded-sm">
                  <img
                    src={profileImage || images.profile_avatar}
                    alt="upload image"
                    className="w-full"
                  />
                  <label
                    htmlFor="profile_image"
                    className="cursor-pointer flex items-center justify-start gap-2"
                  >
                    <Icons.IoCameraOutline />
                    <span>Upload Image</span>
                  </label>
                  <input
                    className="hidden border-[1px] border-slate-300 rounded-md text-md"
                    type="file"
                    name="profileImage"
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
                value="Add student"
                className="btnAdd rounded-md w-40"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddStudent;
