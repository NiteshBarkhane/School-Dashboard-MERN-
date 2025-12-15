import { useAuth } from "../context/authContext";

export function useRequestHandler() {
  const { setLoggedUser } = useAuth();
  function asyncRequestHandler(requestFunc) {
    return async function (...argumentsOfRequestFunc) {
      try {
        const result = await requestFunc(...argumentsOfRequestFunc);
        return {
          success: true,
          data: result.data,
          message: result.message,
        };
      } catch (error) {
        let message = "Frontend Error: Something went wrong.";
        console.log(error);
        if (error.response?.data?.message) {
          if (error.response?.data?.status == 401) {
            message = "Unauthorized access! please login.";
            setLoggedUser(null);
          } else message = error.response.data.message;
        } else {
          message = `Frontend Error: ${error.message}`;
        }

        throw { success: false, message };
      }
    };
  }

  return asyncRequestHandler;
}
