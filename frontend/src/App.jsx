import { BrowserRouter, Routes, Route } from "react-router-dom";

//pages & components
import Navbar from "./components/Navbar.jsx";
import MaterialList from "./components/material/MaterialList.jsx";
import LicenseList from "./components/license/LicenseList.jsx";
import LicenseListForUsers from "./components/license/LicenseListForUsers.jsx";
import SubjectListForUsers from "./components/subject/SubjectListForUsers.jsx";
import MaterialListForUsers from "./components/material/MaterialListForUsers.jsx";
import SubjectList from "./components/subject/SubjectList.jsx";
import Login from "./pages.js/Login.jsx";
import Signup from "./pages.js/Signup.jsx";
import Admin from "./pages.js/Admin.jsx";
import User from "./pages.js/User.jsx";
import UserMyUpload from "./components/users/UserMyUpload.jsx";
import UserFavorites from "./components/users/UserFavorites.jsx";
import MaterialForm from "./components/material/MaterialForm.jsx";
import MaterialView from "./pages.js/MaterialView.jsx";
import LicenseView from "./pages.js/LicenseView.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/examinee" element={<User />} />
            <Route path="/" element={<MaterialListForUsers />} />
            <Route path="/my-uploads" element={<UserMyUpload />} />
            <Route path="/my-favorites" element={<UserFavorites />} />
            <Route path="/upload-materials" element={<MaterialForm />} />
            <Route path="/materials/view/:id" element={<MaterialView />} />
            <Route path="/licenses/view/:id" element={<LicenseView />} />
            <Route path="/get-licenses" element={<LicenseListForUsers />} />
            <Route path="/get-subjects" element={<SubjectListForUsers />} />

            <Route path="/admin" element={<Admin />} />

            <Route path="/materials" element={<MaterialList />} />
            <Route path="/licenses" element={<LicenseList />} />
            <Route path="/subjects" element={<SubjectList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
