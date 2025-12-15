import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Loading } from "./";
import { login } from "../api/apis";
import { useAuth } from "../context/authContext";
import { useRequestHandler } from "../utils/apiRequestHandler";

const initalState = {
  email: "demoadmin@gmail.com",
  password: "admin",
};

const Login = () => {
  const [inputData, setInputData] = useState(initalState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedUser } = useAuth();
  const requestHandler = useRequestHandler();

  function handleInput(event) {
    const { name, value } = event.target;
    setInputData({ ...inputData, [name]: value });
  }

  function handleSubmit(event) {
    setLoading(true);
    event.preventDefault();

    const request = requestHandler(login);

    // login(inputData)
    request(inputData)
      .then((res) => {
        toast.success(res.message);
        setLoggedUser(res.data);
        navigate(`/${res.data.role}/dashboard`);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
        setInputData(initalState);
      });
  }

  // if (Loading) return <MyLoading />;

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="email"
                value={inputData.email}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="password"
                value={inputData.password}
                onChange={handleInput}
                required
              />
            </div>

            <input
              type="submit"
              value="Login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
