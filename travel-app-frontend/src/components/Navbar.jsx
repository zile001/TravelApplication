import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  if (!token) return null;

  return (
    <nav>
      <Link to="/dashboard">Travel Planner</Link>
      <button onClick={handleLogout}>Odjavi se</button>
    </nav>
  );
};
