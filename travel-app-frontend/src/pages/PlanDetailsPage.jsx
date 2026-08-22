import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate, useAsyncError } from "react-router-dom";
import { travelService } from "../api/travelService";
import DestinationButton from "../components/DestinationButton";
import ActivityButton from "../components/ActivityButton";
import FinanceButton from "../components/FinanceButton";
import "../styles/PlanDetailsPage.css";
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

  if (loading)
    return <div className="loading-state">Učitavanje detalja plana...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!plan) return <div className="loading-state">Plan nije pronađen.</div>;

  return (
    <div className="plan-details-container">
      <button className="btn-back" onClick={() => navigate("/dashboard")}>
        Nazad na planove
      </button>
      <div className="plan-card">
        <h2 className="plan-title">{plan.title}</h2>

        <div className="plan-info-grid">
          <div className="info-item">
            <span className="info-label">Period</span>
            <span className="info-value">
              {new Date(plan.startDate).toLocaleDateString()} -{" "}
              {new Date(plan.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="info-item">
            <span className="info-label">Budžet</span>
            <span className="info-value">{plan.budget} €</span>
          </div>
        </div>

        {plan.description && (
          <div className="plan-description">
            <strong>Opis:</strong>
            <p>{plan.description}</p>
          </div>
        )}

        {plan.generalNotes && (
          <div className="plan-notes">
            <strong>Napomene:</strong>
            <p>{plan.generalNotes}</p>
          </div>
        )}

        <div className="action-buttons-grid">
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

          <FinanceButton
            planId={plan.id}
            onClick={() => navigate(`/plans/${id}/finance`)}
          />

          <button
            className="btn-action"
            onClick={() => navigate(`/plans/${plan.id}/checklist`)}
          >
            Ček-lista za pakovanje
          </button>
        </div>
      </div>
    </div>
  );
};
