const LicenseDetails = ({ license }) => {
  return (
    <div className="workout-details">
      <h4>{license.name}</h4>
      <p>{license.description}</p>
      <ul>
        {license.subjectId.map((subject) => {
          <li key={subject._id}>{subject.name}</li>;
        })}
      </ul>
    </div>
  );
};

export default LicenseDetails;
