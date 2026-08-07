import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../api/authService";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {
      await authService.register(formData);
      setSuccess("Registracija uspesna");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Registracija greska:", error);
      setError(
        err.response?.data?.message ||
          "Neuspesna registracija. Pokusajte ponovo",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Kreirajte nalog</h2>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

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
          <label htmlFor="email">Email adresa</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Unesite email.."
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
            placeholder="Unesite lozinku.."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registracija..." : "Registruj se"}
        </button>
      </form>

      <p>
        Već imate nalog? <Link to="/login">Prijavite se</Link>
      </p>
    </div>
  );
};
