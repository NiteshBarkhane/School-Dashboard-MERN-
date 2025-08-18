import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext({
  loggedUser: null,
  setLoggedUser: () => {},
});

export function AuthProvider({ children }) {
  const [loggedUser, setLoggedUser] = useState(() => {
    const user = localStorage.getItem("school_logged_user") || null;
    return user ? JSON.parse(user) : null;
  });

  if (loggedUser && loggedUser?.accessTokenExpiry <= Date.now()) {
    location.assign("/login");
  }

  useEffect(() => {
    if (loggedUser && loggedUser.accessTokenExpiry > Date.now()) {
      localStorage.setItem("school_logged_user", JSON.stringify(loggedUser));
    } else {
      localStorage.removeItem("school_logged_user");
      setLoggedUser(null);
    }
  }, [loggedUser]);

  return (
    <authContext.Provider value={{ loggedUser, setLoggedUser }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
