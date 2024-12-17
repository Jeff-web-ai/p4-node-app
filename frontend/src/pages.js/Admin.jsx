import React from "react";

//pages & components
import LicenseForm from "../components/license/LicenseForm";
import SubjectForm from "../components/subject/SubjectForm";

const Admin = () => {
  return (
    <div>
      <h1>Admin</h1>
      <LicenseForm />
      <SubjectForm />
    </div>
  );
};

export default Admin;
