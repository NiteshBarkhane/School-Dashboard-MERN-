import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Dashboard } from "./pages";
import { Routing } from "./Routes/Router";
import { AuthProvider } from "./context/authContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Routing>
        <Dashboard />
      </Routing>
    </AuthProvider>
  </StrictMode>
);
