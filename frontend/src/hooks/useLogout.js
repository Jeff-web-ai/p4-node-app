import { useAuthContext } from "./useAuthContext.js";

export const useLogout = () => {
  const { dispatch } = useAuthContext();

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_API_SERVER}/api/v1/logout`, {
      method: "GET",
      credentials: "include",
    });

    dispatch({ type: "LOGOUT" });
  };

  return { logout };
};
