import { useEffect, useState } from "react";

//pages & components
import MaterialDetails from "./MaterialDetails.jsx";

const MaterialList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const response = await fetch(
        "http://localhost:5000/api/v1/public/materials"
      );
      const json = await response.json();

      // console.log("Fetched materials:", json);

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
            <MaterialDetails key={material._id} material={material} />
          ))
        ) : (
          <p>No materials available.</p>
        )}
      </div>
    </div>
  );
};

export default MaterialList;
