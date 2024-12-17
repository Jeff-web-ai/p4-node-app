import { useEffect, useState } from "react";

//pages & components
import SubjectDetails from "./SubjectDetails.jsx";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(
        "http://localhost:5000/api/v1/public/subjects"
      );
      const json = await response.json();

      if (response.ok && Array.isArray(json.subjects)) {
        setSubjects(json.subjects);
      } else {
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="home">
      <div className="workouts">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <SubjectDetails key={subject._id} subject={subject} />
          ))
        ) : (
          <p>No subjects available</p>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
