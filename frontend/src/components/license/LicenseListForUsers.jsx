import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//pages & components
import LicenseDetails from "./LicenseDetails.jsx";

const LicenseListForUsers = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_SERVER}/api/v1/get-licenses`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const json = await response.json();

      console.log("fetch licenses", json);

      if (response.ok && Array.isArray(json.licenses)) {
        setLicenses(json.licenses);
      } else {
        setLicenses([]);
      }
    };

    fetchLicenses();
  }, []);

  return (
    <div className="home">
      <div className="workouts">
        {licenses.length > 0 ? (
          licenses.map((license) => (
            <Link to={`/licenses/view/${license._id}`}>
              <LicenseDetails key={license._id} license={license} />
            </Link>
          ))
        ) : (
          <p>No licenses available</p>
        )}
      </div>
    </div>
  );
};

export default LicenseListForUsers;
