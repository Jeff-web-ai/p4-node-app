import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// pages & components

const MaterialView = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const [license, setLicense] = useState("");
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    try {
      const fetchMaterial = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER}/api/v1/materials/view/${id}`,
          {
            withCredentials: true,
          }
        );
        const result = response.data;

        if (result.success) {
          setTitle(result.material.title);
          setDescription(result.material.description);
          setUploadedBy(result.material.uploadedBy.email);
          setLicense(result.material.licenseId.name);
          setSubject(result.material.subjectId.name);
          setFiles(result.material.files);
        } else {
          console.error("Failed to fetch material:", result.message);
        }
      };

      fetchMaterial();
    } catch (error) {
      console.error(
        "Error fetching material:",
        error.response?.data || error.message
      );
    }
  }, [id]);

  const handleFavorite = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_SERVER
        }/api/v1/materials/add-favorites/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.success) {
        alert(
          result.message || "Material successfully added to your favorites!"
        );
      } else {
        alert(result.message || "Failed to add material to favorites.");
      }
    } catch (error) {
      console.error(
        "Error fetching material:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div>
      <div>
        <h4>Title: {title}</h4>
        <p>
          <span>By: {uploadedBy}</span> | License <span>{license}</span>
        </p>
        <p>Subject: {subject}</p>
        <p>Decription:</p>
        <p>{description}</p>
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <a href={file.url} target="_blank">
                {file.fileName}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleFavorite}>Favorite</button>
    </div>
  );
};

export default MaterialView;
