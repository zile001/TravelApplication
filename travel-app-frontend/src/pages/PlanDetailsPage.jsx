import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import { travelService } from "../api/travelService";
import DestinationButton from "../components/DestinationButton";
import ActivityButton from "../components/ActivityButton";

export const PlanDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchPlanDetails();
    }
  }, [id]);

  const fetchPlanDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await travelService.getPlanById(id);
      setPlan(data);
    } catch (err) {
      console.error("Greska pri ucitavanju detalja plana:", err);
      setError("Neuspesno ucitavanje detalja plana");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Učitavanje detalja plana...</div>;
  if (error) return <div>{error}</div>;
  if (!plan) return <div>Plan nije pronađen.</div>;

  return (
    <div>
      <button onClick={() => navigate("/dashboard")}>Nazad na planove</button>

      <h2>{plan.title}</h2>
      <p>
        <strong>Opis:</strong> {plan.description}
      </p>
      <p>
        <strong>Period:</strong> {new Date(plan.startDate).toLocaleDateString()}{" "}
        - {new Date(plan.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong>Budžet:</strong> {plan.budget} €
      </p>
      {plan.generalNotes && (
        <p>
          <strong>Napomene:</strong> {plan.generalNotes}
        </p>
      )}

      <hr />

      {/* Dugmad za Destinacije i Aktivnosti na dnu detalja */}
      <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        <DestinationButton
          planId={plan.id}
          count={plan.destinations?.length}
          onClick={() => navigate(`/plans/${id}/destinations`)}
        />

        <ActivityButton
          planId={plan.id}
          count={plan.activities?.length}
          onClick={() => navigate(`/plans/${id}/activities`)}
        />
      </div>
    </div>
  );
};
