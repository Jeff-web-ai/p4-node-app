import { useState, useEffect } from "react";

const MaterialForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-subjects`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      } else {
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  const handleFileChange = (e) => {
    const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const selectedFiles = Array.from(e.target.files);
    const invalidFiles = selectedFiles.filter(
      (file) => !acceptedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert(
        `Invalid file type detected. Only images (JPEG/PNG) and PDFs are allowed.`
      );
      return;
    }

    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !selectedSubject || files.length === 0) {
      alert("Please fill out all fields and upload at least one file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subjectId", selectedSubject);
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/materials/upload-material`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Material uploaded successfully");
        setTitle("");
        setDescription("");
        selectedSubject("");
        setFiles([]);
      } else {
        alert(result.message || "Failed to upload material");
      }
    } catch (error) {
      console.error("Error uploading Material: ", error);
      alert("An error occured while uploading");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="">
      <h3>Post a new Material</h3>

      <label>Material Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <label>Description: </label>
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>
        Select a subject:
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Upload materials (PDF or Image):
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
      </label>

      <button type="submit">Upload material</button>
    </form>
  );
};

export default MaterialForm;
