import React, { useState } from "react";
import { MyHeader } from "./";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/authContext";
import {
  AdminProfile,
  Loading,
  StudentProfile,
  TeacherProfile,
} from "../component";
import { changePassword } from "../api/apis";
import { useRequestHandler } from "../utils/apiRequestHandler";

const initialPasswordFrom = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const UserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState(initialPasswordFrom);
  const { loggedUser } = useAuth();
  const requestHandler = useRequestHandler();

  // handle password inputs
  function handlePassword(event) {
    const { name, value } = event.target;
    setPasswordData({ ...passwordData, [name]: value });
  }

  // Update password
  function updatePassword(event) {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert("New password and Confirm password is not same.");
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("oldPassword", passwordData.oldPassword);
    formData.append("newPassword", passwordData.newPassword);
    // for (const [key, values] of formData) {
    //   console.log(key, ": ", values);
    // }

    const request = requestHandler(changePassword);
    request(loggedUser.authId, formData)
      .then((res) => {
        console.log(res);
        toast.success(res.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        resetPasswordForm();
      });
  }

  // reset form
  function resetPasswordForm() {
    setPasswordData(initialPasswordFrom);
  }

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <MyHeader title="My Profile" icon="ImProfile" />

      <div className="w-full shadowbox mb-8 p-7">
        {loggedUser.role == "admin" && <AdminProfile />}
        {loggedUser.role == "teacher" && <TeacherProfile />}
        {loggedUser.role == "student" && <StudentProfile />}
      </div>

      {/* Change password */}
      <div className="w-full shadowbox mb-8 p-7">
        <h2 className="text-lg font-bold text-center mb-4">Change Password</h2>
        <form className="md:text-lg" onSubmit={updatePassword}>
          {/* old password */}
          <div className="m-1 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <input
              className="input"
              type="password"
              id="oldPassword"
              placeholder="old password"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePassword}
              required
            />
          </div>
          {/* new password */}
          <div className="m-1 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <input
              className="input"
              type="password"
              id="newPassword"
              placeholder="new password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePassword}
              required
            />
          </div>
          {/* confirm password */}
          <div className="m-1 p-2 flex flex-col md:flex-row justify-normal items-start md:items-center md:gap-20">
            <input
              className="input"
              type="password"
              id="confirmPassword"
              placeholder="confirm password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePassword}
              required
            />
          </div>
          {/* update password */}
          <div className="mt-2 p-2 flex justify-center items-start gap-20">
            <input
              type="submit"
              value="Update password"
              className="btnAdd bg-gray-600 rounded-md w-40"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default UserProfile