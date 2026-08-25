import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import "../styles/DestinationPage.css";
export const DestinationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    arrivalDate: "",
    departureDate: "",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchDestinations();
    }
  }, [id]);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await travelService.getDestinations(id);
      setDestinations(data || []);
    } catch (err) {
      console.error("Greska pri ucitavanju destinacija:", err);
      setError("Neuspesno ucitavanje destinacija");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      setError("");

      const destinationData = {
        name: formData.name,
        location: formData.location,
        arrivalDate: formData.arrivalDate || null,
        departureDate: formData.departureDate || null,
        notes: formData.notes,
      };

      const newDestination = await travelService.addDestination(
        id,
        destinationData,
      );

      if (newDestination) {
        setDestinations((prev) => [...prev, newDestination]);
      } else {
        fetchDestinations();
      }

      setFormData({
        name: "",
        location: "",
        arrivalDate: "",
        departureDate: "",
        notes: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Greska pri dodavanju destinacije:", err);
      setError("Neuspesno dodavanje destinacije");
    }
  };

  const handleDeleteDestination = async (destinationId) => {
    if (
      !window.confirm(
        "Da li ste sigurni da zelite da obrisete ovu destinaciju?",
      )
    )
      return;

    try {
      await travelService.deleteDestination(id, destinationId);
      setDestinations(destinations.filter((d) => d.id !== destinationId));
    } catch (err) {
      alert("Greska pri brisanju destinacije");
    }
  };

  if (loading) return <div>Učitavanje destinacija...</div>;

  return (
    <div className="destination-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${id}`)}>
        ← Nazad na detalje plana
      </button>

      <div className="destination-header">
        <h2>Destinacije</h2>
        <button
          className="btn-toggle-form"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Zatvori formu" : "+ Nova destinacija"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="destination-form-card">
          <form className="destination-form" onSubmit={handleCreateDestination}>
            <h3>Dodaj novu destinaciju</h3>

            <div className="form-group">
              <label>Naziv destinacije / grada:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Lokacija / adresa:</label>
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
                />
              </div>
              <div className="form-group">
                <label>Datum odlaska:</label>
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Napomene:</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <button className="btn-save" type="submit">
              Sačuvaj Destinaciju
            </button>
          </form>
        </div>
      )}

      <div className="destinations-list">
        {destinations.length === 0 ? (
          <p className="empty-message">
            Nema dodatih destinacija za ovaj plan.
          </p>
        ) : (
          destinations.map((dest) => (
            <div key={dest.id} className="destination-card">
              <h3>{dest.name}</h3>
              {dest.location && (
                <p className="destination-info">
                  <strong>Lokacija:</strong> {dest.location}
                </p>
              )}
              {(dest.arrivalDate || dest.departureDate) && (
                <p className="destination-info">
                  <strong>Boravak:</strong>{" "}
                  {dest.arrivalDate
                    ? new Date(dest.arrivalDate).toLocaleDateString()
                    : "—"}{" "}
                  -{" "}
                  {dest.departureDate
                    ? new Date(dest.departureDate).toLocaleDateString()
                    : "—"}
                </p>
              )}
              {dest.notes && (
                <p className="destination-info">
                  <strong>Napomene:</strong> {dest.notes}
                </p>
              )}
              <div className="destination-actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/plans/${id}/destinations/${dest.id}`)
                  }
                >
                  Izmeni
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteDestination(dest.id)}
                >
                  Obriši
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
