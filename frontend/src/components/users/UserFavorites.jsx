import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const UserFavorites = () => {
  const [myFavorites, setMyFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_SERVER}/api/v1/materials/my-favorites`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const result = await response.json();
        if (result.success) {
          setMyFavorites(result.userFavorites[0]?.favoriteId || []);
        } else {
          console.error("Failed to fetch favorites:", result.message);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (id) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_SERVER
        }/api/v1/materials/remove-favorites/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Update the favorites list in the state
        setMyFavorites((prevFavorites) =>
          prevFavorites.filter((material) => material._id !== id)
        );
      } else {
        console.error("Failed to remove favorite:", result.message);
      }
    } catch (error) {
      console.error("Error removing material:", error);
    }
  };

  return (
    <div>
      <h1>My Favorites</h1>
      {myFavorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        myFavorites.map((material) => (
          <div className="workout-details" key={material._id}>
            <h4>{material.title}</h4>
            <p>{material.description}</p>
            <p>{material.licenseId.name}</p>
            <p>{material.subjectId.name}</p>
            <p>{material.uploadedBy.username}</p>
            <ul>
              {material.files.map((file) => (
                <li key={file._id}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
            <button onClick={() => handleRemove(material._id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserFavorites;
