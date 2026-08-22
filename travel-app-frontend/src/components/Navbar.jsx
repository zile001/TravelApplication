import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { authService } from "../api/authService";
import "../styles/Navbar.css";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Sluša promenu URL rute
  const [hasToken, setHasToken] = useState(!!localStorage.getItem("token"));

  // Svaki put kada se promeni stranica (npr. preusmeravanje na /login), osvežavamo stanje tokena
  useEffect(() => {
    const currentToken = localStorage.getItem("token");

    // Ako smo na /login ili /register stranici, sakrij Navbar
    if (location.pathname === "/login" || location.pathname === "/register") {
      setHasToken(false);
    } else {
      setHasToken(!!currentToken);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setHasToken(false); // Eksplicitno obaveštavamo React da je token uklonjen
    navigate("/login");
  };

  // Ako korisnik nije ulogovan ili je na Login/Register stranici, nemoj prikazivati Navbar
  if (!hasToken) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        Travel Planner
      </Link>
      <button className="btn-logout" onClick={handleLogout}>
        Odjavi se
      </button>
    </nav>
  );
};
