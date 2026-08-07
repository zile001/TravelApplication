import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
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
    <div>
      <h2>Prijava na sistem</h2>
      {error && <div>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
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

        <button type="submit" disabled={loading}>
          {loading ? "Prijavljivanje..." : "Prijavi se"}
        </button>
      </form>

      <p>
        Nemate nalog? <Link to="/register">Registrujte se ovde</Link>
      </p>
    </div>
  );
};
