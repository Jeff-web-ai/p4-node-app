import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const navigate = useNavigate();

  const handleClick = () => {
    logout();

    navigate("/login");
  };

  console.log(user);

  return (
    <header>
      <div className="container">
        <h1>LicenseHub</h1>

        <nav>
          {user ? (
            user.role === "examinee" ? (
              <div>
                <div>
                  <Link to="/">Materials</Link>
                  <Link to="/examinee">My Profile</Link>
                  <Link to="/upload-materials">Upload</Link>
                  <Link to="/materials/remove-favorites/:id"></Link>
                  <Link to="/materials/add-favorites/:id"></Link>
                  <Link to="/materials/view/:id"></Link>
                </div>
                <div>
                  <button onClick={handleClick}>Log out</button>
                </div>
              </div>
            ) : user.role === "admin" ? (
              <div>
                <div>
                  <Link to="/get-licenses">Licenses</Link>
                  <Link to="/get-subjects">Subjects</Link>
                  <Link to="/Admin">Admin</Link>
                </div>
                <div>
                  <button onClick={handleClick}>Log out</button>
                </div>
              </div>
            ) : null
          ) : (
            <div>
              <Link to="/licenses">License</Link>
              <Link to="/subjects">Subject</Link>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
