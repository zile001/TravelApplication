import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import "../styles/UpdatePage.css";

export const UpdateActivityPage = () => {
  const { planId, activityId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    id: activityId,
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    estimatedCost: 0,
    status: "Planirano",
  });

  useEffect(() => {
    if (planId && activityId) {
      loadActivityData();
    }
  }, [planId, activityId]);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      setError("");

      const planData = await travelService.getPlanById(planId);
      const activity = planData.activities?.find((a) => a.id === activityId);

      if (activity) {
        // Formatiranje datuma za html date input (YYYY-MM-DD)
        const formattedDate = activity.date
          ? new Date(activity.date).toISOString().split("T")[0]
          : "";

        setFormData({
          id: activity.id || activityId,
          title: activity.title || "",
          date: formattedDate,
          time: activity.time || "00:00:00",
          location: activity.location || "",
          description: activity.description || "",
          estimatedCost: activity.estimatedCost || 0,
          status: activity.status || "Planirano",
        });
      } else {
        setError("Aktivnost nije pronađena u ovom planu.");
      }
    } catch (err) {
      console.error("Greska pri ucitavanju aktivnosti za izmenu:", err);
      setError("Neuspesno ucitavanje podataka o aktivnosti.");
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
        // Osiguravamo format HH:mm:ss za C# TimeSpan
        time:
          formData.time.length === 5 ? `${formData.time}:00` : formData.time,
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
      };

      await travelService.updateActivity(planId, activityId, payload);
      navigate(`/plans/${planId}/activities`);
    } catch (err) {
      console.error("Greska pri izmeni aktivnosti:", err);
      setError(
        err.response?.data?.Message || "Neuspesno cuvanje izmena aktivnosti.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="loading-state">Učitavanje aktivnosti...</div>;

  return (
    <div className="update-page-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${planId}`)}>
        ← Nazad na detalje plana
      </button>

      <div className="update-card">
        <h2>Izmeni aktivnost</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label>Naziv aktivnosti:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Datum:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Vreme:</label>
              <input
                type="time"
                step="1"
                name="time"
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lokacija:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Procenjeni trošak (€):</label>
              <input
                type="number"
                step="0.01"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="Planirano">Planirano</option>
              <option value="Rezervisano">Rezervisano</option>
              <option value="Zavrseno">Završeno</option>
              <option value="Otkazano">Otkazano</option>
            </select>
          </div>

          <div className="form-group">
            <label>Opis:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/plans/${planId}`)}
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
