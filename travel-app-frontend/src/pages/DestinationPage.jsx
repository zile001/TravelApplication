import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";

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
      const data = await travelService.getDestinationsByPlanId(id);
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
    //ispraviti ovo
    e.preventDefault();
    try {
      setError("");
      await travelService.addDestination(id, {
        ...formData,
      });

      setFormData({
        name: "",
        location: "",
        arrivalDate: "",
        departureDate: "",
        notes: "",
      });
      setShowForm(false);
      fetchDestinations();
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
      await travelService.deleteDestination(destinationId);
      setDestinations(destinations.filter((d) => d.id !== destinationId));
    } catch (err) {
      alert("Greska pri brisanju destinacije");
    }
  };

  if (loading) return <div>Učitavanje destinacija...</div>;

  return (
    <div>
      <button onClick={() => navigate(`/plans/${id}`)}>
        ← Nazad na detalje plana
      </button>

      <div>
        <h2>Destinacije</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Zatvori formu" : "+ Nova destinacija"}
        </button>
      </div>

      {error && <div>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreateDestination}>
          <h3>Dodaj novu destinaciju</h3>

          <div>
            <label>Naziv destinacije / grada:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Lokacija / adresa:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Datum dolaska:</label>
            <input
              type="date"
              name="arrivalDate"
              value={formData.arrivalDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Datum odlaska:</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Napomene:</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit">Sačuvaj Destinaciju</button>
        </form>
      )}

      <div>
        {destinations.length === 0 ? (
          <p>Nema dodatih destinacija za ovaj plan.</p>
        ) : (
          destinations.map((dest) => (
            <div
              key={dest.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{dest.name}</h3>
              {dest.location && (
                <p>
                  <strong>Lokacija:</strong> {dest.location}
                </p>
              )}
              {(dest.arrivalDate || dest.departureDate) && (
                <p>
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
                <p>
                  <strong>Napomene:</strong> {dest.notes}
                </p>
              )}

              <button onClick={() => handleDeleteDestination(dest.id)}>
                Obriši
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
