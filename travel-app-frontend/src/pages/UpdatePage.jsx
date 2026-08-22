import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import "../styles/UpdatePage.css";

export const UpdatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: id,
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: 0,
    generalNotes: "",
  });

  useEffect(() => {
    if (id) {
      loadPlanData();
    }
  }, [id]);

  const loadPlanData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await travelService.getPlanById(id);

      // Formatiranje datuma za html date input (YYYY-MM-DD)
      const formattedStartDate = data.startDate
        ? new Date(data.startDate).toISOString().split("T")[0]
        : "";
      const formattedEndDate = data.endDate
        ? new Date(data.endDate).toISOString().split("T")[0]
        : "";

      setFormData({
        id: data.id || id,
        title: data.title || "",
        description: data.description || "",
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        budget: data.budget || 0,
        generalNotes: data.generalNotes || "",
      });
    } catch (err) {
      console.error("Greska pri ucitavanju plana za izmenu:", err);
      setError("Neuspesno ucitavanje podataka o planu.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const payload = {
        ...formData,
        budget: parseFloat(formData.budget) || 0,
      };

      await travelService.updatePlan(id, payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Greska pri izmeni plana:", err);
      setError(
        err.response?.data?.Message || "Neuspesno cuvanje izmena plana.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Učitavanje plana...</div>;

  return (
    <div className="update-page-container">
      <button className="btn-back" onClick={() => navigate("/dashboard")}>
        ← Nazad na planove
      </button>

      <div className="update-card">
        <h2>Izmeni plan putovanja</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label>Naziv putovanja:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Opis:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Datum početka:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Datum završetka:</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Budžet (€):</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Napomene:</label>
            <textarea
              name="generalNotes"
              value={formData.generalNotes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/dashboard")}
            >
              Otkaži
            </button>
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Čuvanje..." : "Sačuvaj izmene"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
