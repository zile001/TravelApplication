import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import "../styles/ActivityPage.css";

export const ActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    estimatedCost: "",
    status: "",
  });

  useEffect(() => {
    if (id) {
      fetchActivities();
    }
  }, [id]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await travelService.getActivities(id);
      setActivities(data || []);
    } catch (err) {
      console.error("Greska pri ucitavanju aktivnosti:", err);
      setError("Neuspesno ucitavanje aktivnosti");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      setError("");

      let formattedTime = null;
      if (formData.time) {
        formattedTime =
          formData.time.length === 5 ? `${formData.time}:00` : formData.time;
      }

      const parsedCost =
        formData.estimatedCost !== "" ? Number(formData.estimatedCost) : null;

      const activityData = {
        title: formData.title,
        date: formData.date || null,
        time: formattedTime,
        location: formData.location,
        description: formData.description,
        estimatedCost: parsedCost,
        status: formData.status,
      };

      const newActivity = await travelService.addActivity(id, activityData);

      if (newActivity) {
        setActivities((prev) => [...prev, newActivity]);
      } else {
        await fetchActivities();
      }

      setFormData({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        estimatedCost: "",
        status: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Greska pri dodavanju aktivnosti:", err);
      setError("Neuspesno dodavanje aktivnosti");
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (
      !window.confirm("Da li ste sigurni da zelite da obrisete ovu aktivnost?")
    )
      return;

    try {
      await travelService.deleteActivity(id, activityId);
      setActivities(activities.filter((a) => a.id !== activityId));
    } catch (err) {
      alert("Greska pri brisanju aktivnosti");
    }
  };

  if (loading) return <div>Ucitavanje aktivnosti...</div>;

  return (
    <div className="activity-container">
      <button className="btn-back" onClick={() => navigate(`/plans/${id}`)}>
        ← Nazad na detalje plana
      </button>

      <div className="activity-header">
        <h2>Aktivnosti</h2>
        <button
          className="btn-toggle-form"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Zatvori formu" : "+ Nova aktivnost"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="activity-form-card">
          <form className="activity-form" onSubmit={handleCreateActivity}>
            <h3>Dodaj novu aktivnost</h3>

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
                />
              </div>
              <div className="form-group">
                <label>Vreme:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
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
            <div className="form-group">
              <label>Opis:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ocekivan trosak:</label>
                <input
                  type="number"
                  name="estimatedCost"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="btn-save" type="submit">
              Sačuvaj aktivnost
            </button>
          </form>
        </div>
      )}

      <div className="activities-list">
        {activities.length === 0 ? (
          <p className="empty-message">Nema dodatih aktivnosti za ovaj plan.</p>
        ) : (
          activities.map((activ) => (
            <div className="activity-card" key={activ.id}>
              <h3>{activ.title}</h3>
              {activ.location && (
                <p className="activity-info">
                  <strong>Lokacija:</strong> {activ.location}
                </p>
              )}
              {activ.status && (
                <p className="activity-info">
                  <strong>Status:</strong> {activ.status}
                </p>
              )}
              <div className="activity-actions">
                <button
                  className="btn-edit"
                  onClick={() =>
                    navigate(`/plans/${id}/activities/${activ.id}`)
                  }
                >
                  Izmeni
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeleteActivity(activ.id)}
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
