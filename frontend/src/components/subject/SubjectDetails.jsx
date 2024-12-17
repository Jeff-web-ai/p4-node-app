import React from "react";

const SubjectDetails = ({ subject }) => {
  return (
    <div className="workout-details">
      <h4>{subject.name}</h4>
      <p>
        <span>{subject.licenseId.name}</span>
      </p>
      <p>{subject.description}</p>
    </div>
  );
};

export default SubjectDetails;
