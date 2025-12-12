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

  // logout user
  function handleLogout() {
    setLoading(true);
    const request = requestHandler(logout);

    request()
      .then((res) => {
        console.log(res);
        toast.success(res.message);
        setLoggedUser(null);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      {loading ? <Loading /> : ""}
      <Toaster position="top-right" reverseOrder={false} />

      <div>
        <h1 className="mb-7">Home</h1>

        <div className="flex gap-4 m-4">
          {!loggedUser ? (
            <Link className="btn bg-blue-600 rounded-md" to={"/login"}>
              Login
            </Link>
          ) : (
            <>
              <Link
                to={`/${loggedUser.role}/dashboard`}
                className="btn bg-red-600 rounded-md"
              >
                View Dashboard
              </Link>
              <button
                className="btn bg-blue-600 rounded-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home