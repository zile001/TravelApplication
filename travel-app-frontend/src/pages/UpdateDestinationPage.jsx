import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import "../styles/UpdatePage.css";

export const UpdateDestinationPage = () => {
  const { planId, destinationId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    arrivalDate: "",
    departureDate: "",
    notes: "",
  });

  useEffect(() => {
    if (planId && destinationId) {
      loadDestinationData();
    }
  }, [planId, destinationId]);

  const loadDestinationData = async () => {
    try {
      setLoading(true);
      setError("");

      const planData = await travelService.getPlanById(planId);
      const destination = planData.destinations?.find(
        (d) => d.id === destinationId,
      );

      if (destination) {
        // Formatiranje datuma za HTML input [type="date"] (YYYY-MM-DD)
        const formattedArrival = destination.arrivalDate
          ? new Date(destination.arrivalDate).toISOString().split("T")[0]
          : "";
        const formattedDeparture = destination.departureDate
          ? new Date(destination.departureDate).toISOString().split("T")[0]
          : "";

        setFormData({
          name: destination.name || "",
          location: destination.location || "",
          arrivalDate: formattedArrival,
          departureDate: formattedDeparture,
          notes: destination.notes || "",
        });
      } else {
        setError("Destinacija nije pronađena u ovom planu.");
      }
    } catch (err) {
      console.error("Greška pri učitavanju destinacije:", err);
      setError("Neuspešno učitavanje podataka o destinaciji.");
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

      // Mapiranje podataka tačno prema CreateDestinationDTO strukturi sa C# backenda
      const payload = {
        name: formData.name,
        location: formData.location,
        arrivalDate: formData.arrivalDate
          ? new Date(formData.arrivalDate).toISOString()
          : null,
        departureDate: formData.departureDate
          ? new Date(formData.departureDate).toISOString()
          : null,
        notes: formData.notes,
      };

      await travelService.updateDestination(planId, destinationId, payload);
      navigate(`/plans/${planId}`);
    } catch (err) {
      console.error("Greška pri izmeni destinacije:", err);
      const serverMessage =
        err.response?.data?.Message ||
        err.response?.data?.message ||
        "Neuspešno čuvanje izmena destinacije.";
      setError(serverMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="loading-state">Učitavanje destinacije...</div>;

  return (
    <div className="update-page-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${planId}`)}>
        ← Nazad na detalje plana
      </button>

      <div className="update-card">
        <h2>Izmeni destinaciju</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label>Naziv destinacije:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Lokacija:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Datum dolaska:</label>
              <input
                type="date"
                name="arrivalDate"
                value={formData.arrivalDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Datum odlaska:</label>
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Napomene:</label>
            <textarea
              name="notes"
              value={formData.notes}
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
