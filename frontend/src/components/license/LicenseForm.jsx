import { useState } from "react";

const LicenseForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const licenseData = {
      name,
      description,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_SERVER}/api/v1/add-license`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(licenseData),
      }
    );

    const result = await response.json();

    console.log(result);
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add New Licensure Exam</h3>

      <label>License:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>
        Description:
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </label>

      <button type="submit">Add License</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default LicenseForm;
