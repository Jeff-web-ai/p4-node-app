import { useState, useEffect } from "react";

import { Link } from "react-router-dom";

const User = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [license, setLicense] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        setUsername(data.userInfo.username);
        setEmail(data.userInfo.email);
        setRole(data.userInfo.role);
        setLicense(data.userInfo.licenseId.name);
      } catch (error) {
        alert("Error fetching info", error);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <div>
      <h1>
        Welcome: <span>{username}</span>
      </h1>

      <h3>About me</h3>
      <p>
        Email: <span>{email}</span>
      </p>
      <p>
        Status: <span>{role}</span>
      </p>
      <p>
        Taking: <span>{license}</span>
      </p>
      <div>
        <Link to="/my-uploads">My uploads</Link>
      </div>
      <div>
        <Link to="/my-favorites">My Favorites</Link>
      </div>
    </div>
  );
};

export default User;
