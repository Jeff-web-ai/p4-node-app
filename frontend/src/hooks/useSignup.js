import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const signup = async (username, email, password, role, licenseId) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password, role, licenseId }),
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        setError(json.message || "Signup failed");
      } else {
        // Save user to local storage
        const userInfo = {
          username: json.username,
          email: json.email,
          password: json.password,
          role: json.role,
          licenseId: json.licenseId,
        };

        // Update AuthContext
        dispatch({ type: "LOGIN", payload: userInfo });
        navigate("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
