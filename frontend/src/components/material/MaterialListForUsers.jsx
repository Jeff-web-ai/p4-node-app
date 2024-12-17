import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//pages & components
import MaterialDetails from "./MaterialDetails.jsx";

const MaterialListForUsers = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-materials`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const json = await response.json();

      if (response.ok && Array.isArray(json.materials)) {
        setMaterials(json.materials);
      } else {
        setMaterials([]);
      }
    };

    fetchMaterials();
  }, []);
  return (
    <div className="home">
      <div className="workouts">
        {materials.length > 0 ? (
          materials.map((material) => (
            <Link to={`/materials/view/${material._id}`}>
              <MaterialDetails key={material._id} material={material} />
            </Link>
          ))
        ) : (
          <p>No materials available.</p>
        )}
      </div>
    </div>
  );
};

export default MaterialListForUsers;
