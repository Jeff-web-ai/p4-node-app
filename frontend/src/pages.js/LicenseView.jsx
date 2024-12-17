import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const LicenseView = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    try {
      const fetchLicense = async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_API_SERVER}/api/v1/view-license/${id}`,
          {
            withCredentials: true,
          }
        );
        const result = response.data;

        console.log(result);

        if (result.success) {
          setName(result.license.name);
          setDescription(result.license.description);
          setSubjects(result.license.subjectId);
        } else {
          alert(result.message);
        }
      };

      fetchLicense();
    } catch (error) {
      console.error(
        "Error fetching material:",
        error.response?.data || error.message
      );
    }
  }, [id]);
  return (
    <div>
      <div>
        <h4>Title: {name}</h4>
        <p>Decription:</p>
        <p>{description}</p>
        <ul>
          {subjects.length === 0 ? (
            <p>No Subject yet.</p>
          ) : (
            subjects.map((data) => <li key={data._id}>{data.name}</li>)
          )}
        </ul>
      </div>
    </div>
  );
};

export default LicenseView;
