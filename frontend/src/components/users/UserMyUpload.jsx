import { useState, useEffect } from "react";

// components
import MaterialDetails from "../material/MaterialDetails";

const UserMyUpload = () => {
  const [myUploads, setMyUpload] = useState([]);

  useEffect(() => {
    const fetchMyUploads = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/materials/my-uploads`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const results = await response.json();
      if (response.ok) {
        setMyUpload(results.materials);
      }
    };
    fetchMyUploads();
  }, []);

  return (
    <div>
      <h1>My Upload</h1>
      {myUploads.length > 0 ? (
        myUploads.map((material) => (
          <MaterialDetails key={material._id} material={material} />
        ))
      ) : (
        <p>No materials available</p>
      )}
    </div>
  );
};

export default UserMyUpload;
