import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useRequestHandler } from "../utils/apiRequestHandler";
import { logout } from "../api/apis";
import { Loading } from "../component";
import toast, { Toaster } from "react-hot-toast";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const requestHandler = useRequestHandler();
  const { loggedUser, setLoggedUser } = useAuth();

  function handleLogout() {
    setLoading(true);
    const request = requestHandler(logout);

    request()
      .then((res) => {
        toast.success(res.message);
        setLoggedUser(null);
      })
      .catch((err) => {
        toast.error(err.message || "Logout failed");
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {loading && <Loading />}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-indigo-600">School Management Dashboard</span>
          </h1>

          <p className="text-gray-600 mb-10">
            A secure and modern platform to manage your dashboard, users,
            and data efficiently.
          </p>

          {!loggedUser ? (
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to={`/${loggedUser.role}/dashboard`}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 text-sm text-gray-400">
            © {new Date().getFullYear()} NItesh Barkhane. All rights reserved.
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
