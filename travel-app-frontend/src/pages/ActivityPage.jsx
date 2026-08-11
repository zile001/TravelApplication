import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";

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
        fetchActivities();
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
      fetchActivities();
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
    <div>
      <button onClick={() => navigate(`/plans/${id}`)}>
        ← Nazad na detalje plana
      </button>

      <div>
        <h2>Aktivnosti</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Zatvori formu" : "+ Nova aktivnost"}
        </button>
      </div>

      {error && <div>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreateActivity}>
          <h3>Dodaj novu aktivnost</h3>

          <div>
            <label>Naziv aktivnosti:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Datum:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Vreme:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Lokacija:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Opis:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div>
            <label>Ocekivan trosak:</label>
            <input
              type="number"
              name="estimatedCost"
              value={formData.estimatedCost}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Status:</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Sačuvaj aktivnost</button>
        </form>
      )}

      <div>
        {activities.length === 0 ? (
          <p>Nema dodatih destinacija za ovaj plan.</p>
        ) : (
          activities.map((activ) => (
            <div
              key={activ.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
              }}
            >
              <h3>{activ.title}</h3>
              {activ.location && (
                <p>
                  <strong>Lokacija:</strong> {activ.location}
                </p>
              )}
              {activ.status && (
                <p>
                  <strong>Status:</strong> {activ.status}
                </p>
              )}

              <button onClick={() => handleDeleteActivity(activ.id)}>
                Obriši
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
