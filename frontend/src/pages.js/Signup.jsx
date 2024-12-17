import { useState, useEffect } from "react";

import { useSignup } from "../hooks/useSignup.js";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState("");

  const { signup, error, isLoading } = useSignup();

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/public/licenses`
      );

      const json = await response.json();

      if (response.ok && Array.isArray(json.licenses)) {
        setLicenses(json.licenses);
      } else {
        setLicenses([]);
      }
    };

    fetchLicenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(username, email, password, role, selectedLicense);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>

      <label>Username:</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />
      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <label>
        Role:
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Select Role</option>
          <option value="examinee">Examinee</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <label>
        License:
        <select
          value={selectedLicense}
          onChange={(e) => setSelectedLicense(e.target.value)}
        >
          <option value="">Select License</option>
          {licenses.map((license) => (
            <option key={license._id} value={license._id}>
              {license.name}
            </option>
          ))}
        </select>
      </label>

      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
