import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { travelService } from "../api/travelService";
import DestinationButton from "../components/DestinationButton";
import ActivityButton from "../components/ActivityButton";

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: 0,
    generalNotes: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await travelService.getPlans();
      setPlans(data || []);
    } catch (err) {
      console.error("Greska pri ucitavanju planova:", err);
      setError("Neuspesno ucitavanje planova putovanja");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await travelService.createPlan({
        ...formData,
        budget: parseFloat(formData.budget) || 0,
      });

      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        budget: 0,
        generalNotes: "",
      });
      setShowForm(false);
      fetchPlans();
    } catch (err) {
      console.error("Greska pri kreiranju plana", err);
      setError(err.response?.data?.Message || "Neuspesno kreiranje plana");
    }
  };

  const handleDeletePlan = async (planId, e) => {
    e.stopPropagation();
    if (!window.confirm("Da li ste sigurni da zelite da obrisete ovaj plan?"))
      return;

    try {
      await travelService.deletePlan(planId);
      setPlans(plans.filter((p) => p.id !== planId));
    } catch (err) {
      alert("Greska pri brisanju plana");
    }
  };

  if (loading) return <div>Učitavanje planova...</div>;

  return (
    <div>
      <div>
        <h2>Moji planovi putovanja</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Zatvori formu" : "+ Novo putovanje"}
        </button>
      </div>

      {error && <div>{error}</div>}

      {showForm && (
        <form onSubmit={handleCreatePlan}>
          <h3>Kreiraj novo putovanje</h3>

          <div>
            <label>Naziv putovanja:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Opis:</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <div>
              <label>Datum početka:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
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
          <div>
            <label>Budžet (€):</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Napomene:</label>
            <textarea
              name="generalNotes"
              value={formData.generalNotes}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button type="submit">Sačuvaj Plan</button>
        </form>
      )}

      <div>
        {plans.length === 0 ? (
          <p>Trenutno nemate kreiranih planova putovanja</p>
        ) : (
          plans.map((plan) => (
            <div key={plan.id} onClick={() => navigate(`/plans/${plan.id}`)}>
              <div>
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <div>
                  {new Date(plan.startDate).toLocaleDateString()} -{" "}
                  {new Date(plan.endDate).toLocaleDateString()}
                </div>
                <div>{plan.budget}</div>
              </div>
              <div>
                <button onClick={(e) => handleDeletePlan(plan.id, e)}>
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
