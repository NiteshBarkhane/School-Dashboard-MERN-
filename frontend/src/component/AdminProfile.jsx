import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { images } from "../assets/images";
import { Icons } from "../assets/icons/lcons";
import { useRequestHandler } from "../utils/apiRequestHandler";
import { useAuth } from "../context/authContext";
import { getAdmin, updatedmin } from "../api/apis";
import { Loading } from "./";

const initialFormState = {
  name: "",
  email: "",
  profileImage: "",
};

const AdminProfile = () => {
  // All states and hooks
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState(initialFormState);
  const [profileImage, setProfileImage] = useState(
    initialFormState.profileImage
  );
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
  console.log(loggedUser);
  // get student data from database
  async function getAdminData() {
    setLoading(true);
    const request = requestHandler(getAdmin);
    request(loggedUser.userDataId)
      .then((res) => {
        setInputData(res.data);
        setProfileImage(res.data?.profileImage);
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
    if (loggedUser.email == "demoadmin@gmail.com") {
      return toast(
        "This is an demo/test account. You can add new student/teacher to check this feature",
        { icon: "⚠️" }
      );
    }
    setLoading(true);
    const formData = new FormData();
    for (const key in inputData) {
      formData.append(key, inputData[key]);
    }
    // for (const [key, values] of formData) {
    //   console.log(key, ": ", values);
    // }

    const request = requestHandler(updatedmin);
    request(loggedUser.userDataId, formData)
      .then((res) => {
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .then(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getAdminData();
  }, []);

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <h2 className="text-lg font-bold text-center mb-4">Edit Profile</h2>
      <form className="md:text-lg" onSubmit={handleSubmit}>
        {/* name */}
        <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
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
        <div className="m-2 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
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
        {/* update */}
        <div className="m-2 p-2 flex justify-center items-start gap-20">
          <input
            type="submit"
            value="Update"
            className="btnAdd bg-gray-600 rounded-md w-40"
          />
        </div>
      </form>
    </>
  );
};

export default AdminProfile;
