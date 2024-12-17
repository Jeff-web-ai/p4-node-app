import React from "react";

const UserFavoritesDetails = ({ material }) => {
  return (
    <div className="workout-details">
      <h4>{material.title}</h4>
      <p>{material.description}</p>
      <p>{material.licenseId.name}</p>
      <p>{material.subjectId.name}</p>
      <p>{material.uploadedBy.username}</p>
      <ul>
        {material.files.map((file) => (
          <li key={file._id}>
            <a href={`${file.url}`} target="_blank">
              {file.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserFavoritesDetails;
