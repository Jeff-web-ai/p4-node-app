import { useEffect, useState } from "react";

//pages & components
import LicenseDetails from "./LicenseDetails.jsx";

const LicenseList = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    const fetchLicenses = async () => {
      const response = await fetch(
        "http://localhost:5000/api/v1/public/licenses"
      );

      const json = await response.json();

      // console.log("fetch licenses", json);

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
            <LicenseDetails key={license._id} license={license} />
          ))
        ) : (
          <p>No licenses available</p>
        )}
      </div>
    </div>
  );
};

export default LicenseList;
