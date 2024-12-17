import { useState, useEffect } from "react";

const SubjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-licenses`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setLicenses(data.licenses);
      } else {
        setLicenses([]);
      }
    };

    fetchLicenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subjectData = {
      name,
      description,
      licenseId: selectedLicense,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_SERVER}/api/v1/add-subject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.message);
    }

    if (response.ok) {
      setName("");
      setDescription("");
      setSelectedLicense("");
      alert("New subject is successfully created");
      setError(null);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h3>Add new Subject </h3>

      <label>Subject</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>Description:</label>
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <label>
        Select a License:
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

      <button type="submit">Add Subject</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default SubjectForm;
