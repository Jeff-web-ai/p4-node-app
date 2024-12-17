import { useEffect, useState } from "react";

//pages & components
import SubjectDetails from "./SubjectDetails.jsx";

const SubjectListForUsers = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-subjects`,
        {
          method: "GET",
          credentials: "include",
        }
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

export default SubjectListForUsers;
