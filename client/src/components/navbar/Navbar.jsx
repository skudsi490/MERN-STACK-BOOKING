import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./navbar.css";
import logoImage from "../../assets/TripAura.png";

const Navbar = () => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        <Link to="/" className="navLogo">
          <img src={logoImage} alt="Logo" className="logoImg" />
        </Link>
        <div className="navItems">
          {user ? (
            <>
              <span className="navUser">Hello, {user.username}</span>
              <Link to="/my-bookings" className="navItem">
                My Booking
              </Link>
              <button onClick={handleLogout} className="navLogoutButton">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="navItem">
                Register
              </Link>
              <Link to="/login" className="navItem">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
