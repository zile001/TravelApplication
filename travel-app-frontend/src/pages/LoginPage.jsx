import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";
import "../styles/LoginPage.css";
export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);

      const token = response?.token || response?.data?.token || response;
      if (typeof token === "string") {
        localStorage.setItem("token", token);
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      setError(err.response?.data?.message || "Neuspesna prijava");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Prijava na sistem</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Korisnicko ime</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Unesite username.."
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Lozinka</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Unesite lozinku"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>

        <p className="register-prompt">
          Nemate nalog? <Link to="/register">Registrujte se ovde</Link>
        </p>
      </div>
    </div>
  );
};
