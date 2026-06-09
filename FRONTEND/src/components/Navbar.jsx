import { Link, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";


function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">

      {/* LOGO */}
      <h2 className="logo">EventApp</h2>

      {/* SEARCH */}
      <div className="nav-search">
        <SearchBar />
      </div>

      {/* NAVIGATION */}
      <div className="nav-links">

        <Link
          className={isActive("/") ? "nav-btn active" : "nav-btn"}
          to="/"
        >
          Home
        </Link>

        {/* Every logged-in user can upload */}
        {user && (
          <Link
            className={isActive("/upload") ? "nav-btn active" : "nav-btn"}
            to="/upload"
          >
            Upload
          </Link>
        )}

        <Link
          className={isActive("/gallery") ? "nav-btn active" : "nav-btn"}
          to="/gallery"
        >
          Gallery
        </Link>
        <Link to="/my-photos" className="nav-btn">
          📸 My Photos
        </Link>

        {/* Every logged-in user gets a dashboard */}
        {user && (
  <Link
    className={isActive("/dashboard") ? "nav-btn active" : "nav-btn"}
    to="/dashboard"
  >
    Dashboard
  </Link>
)}

{user && (
  <Link
    className={isActive("/favorites") ? "nav-btn active" : "nav-btn"}
    to="/favorites"
  >
    Favorites
  </Link>
)}

        {/* Profile */}
        {user && (
          <Link
            className={isActive("/profile") ? "nav-btn active" : "nav-btn"}
            to="/profile"
          >
            Profile
          </Link>
        )}

        {user ? (
          <>
            <NotificationBell />

            <span className="user-name">
              {user.name}
            </span>

            <button
              className="nav-btn"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              className={isActive("/login") ? "nav-btn active" : "nav-btn"}
              to="/login"
            >
              Login
            </Link>

            <Link
              className={isActive("/register") ? "nav-btn active" : "nav-btn"}
              to="/register"
            >
              Register
            </Link>
          </>
        )}

      </div>
    </nav>
  );
}

export default Navbar;